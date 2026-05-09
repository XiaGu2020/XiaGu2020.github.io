---
title: 三大Agent框架横评 OpenClaw / Hermes / Claude Code
description: 从架构、记忆、工具调用、上下文管理四个维度横向对比三大开源Agent框架的工程实现
date: 2026-05-09
tags:
  - Agent
  - LLM
  - 工程化
---

# 三大Agent框架横评：OpenClaw / Hermes / Claude Code

> 修订说明：本版相对于原文，删除了若干无可靠出处的事实陈述（如"OpenAI收购OpenClaw""Anthropic源码泄露512K行""OpenAI在Codex里写AGENTS.md"等），同时补充了代码示例与选型时的成本/可观测性维度。带 `（待考证）` 标记的条目，是社区流传但尚未找到一手资料的说法，使用时请自行核实。

## 引言：为什么是这三个

最近Agent开发岗的面试越来越细。"你了解哪些Agent框架？记忆机制、工具调用、上下文管理怎么实现"——这种问题如果只能背名字，基本聊不下去。

OpenClaw、Hermes、Claude Code 是社区里讨论最多的三个开源/半开源Agent框架，也是Harness Engineering（Anthropic 提出的"模型外的工程层"）的三种典型实现思路：

- **OpenClaw**：工具执行系统，全平台个人助手
- **Hermes**：自进化系统，靠学习闭环越用越强
- **Claude Code**：安全工程化系统，编程场景的产品级Agent

> Harness Engineering 简单说就是：Agent = Model + Harness。模型负责推理，Harness负责"工具、记忆、上下文、约束、调度、恢复"这六层。三个框架的差异，本质上是六层组件的取舍不同。

这篇拉一份横向对比，从架构到代码层面把三者讲清楚。

---

## 一、定位与起源

| 框架 | 一句话定位 | 起源 | 主语言 |
|---|---|---|---|
| OpenClaw | 全平台个人助手 | 独立开发者社区项目，吉祥物太空龙虾Molty | TypeScript |
| Hermes | 自进化Agent | 社区项目，主打 Learning Loop（待考证：与 Nous Research 的 Hermes 模型系列**不是同一个东西**，注意区分）| Python |
| Claude Code | 产品级编程Agent | Anthropic 官方推出，npm 包分发，社区已有较完整的反编译分析 | TypeScript |

几个需要纠偏的说法：

1. **OpenClaw 是否被 OpenAI 收购？** 公开渠道没有任何官方公告，社区流传的"被收购"说法疑为讹传，请勿当作事实背诵。
2. **Claude Code 源码是否被泄露？** Anthropic 没有公开过完整源码。社区拿到的内容来自 npm 分发包的反编译，质量参差，引用时应以"社区分析"而非"官方源码"作为措辞。
3. **Hermes 与 Nous Research Hermes 模型系列没关系**，前者是Agent框架，后者是 LLM 微调模型，重名容易踩坑。

---

## 二、架构对比：Agent Loop 怎么跑

三者核心都是 ReAct 循环（接收→思考→执行→观察→继续/结束），差别在编排方式。

### OpenClaw：单 Agent 线性循环

```ts
// 伪代码
async function loop(input: string) {
  const ctx = injectFiles(['AGENTS.md', 'SOUL.md', 'TOOLS.md']);
  let messages = [...ctx, { role: 'user', content: input }];
  while (true) {
    const resp = await llm.chat(messages);
    if (resp.type === 'final') return resp.content;
    const toolResult = await runTool(resp.tool, resp.params); // 单线程
    messages.push({ role: 'tool', content: toolResult });
  }
}
```

特点：没有子Agent，复杂任务靠 Prompt 拆解或外部调度器。

### Hermes：单 Agent + 子Agent 并行 + 学习闭环

```python
# 伪代码
async def loop(task):
    while not done:
        plan = await llm.plan(task, ctx)
        if plan.subtasks:                          # 子Agent并行
            results = await asyncio.gather(*[
                spawn_subagent(st) for st in plan.subtasks
            ])
            ctx.merge(results)
        else:
            ctx.append(await run_tool(plan.tool, plan.params))
        if plan.finished:
            skill = await distill_skill(task, ctx)  # 学习闭环
            save_skill(skill, '~/.hermes/skills/')
            done = True
```

关键点是循环结束时的 `distill_skill` —— 把这次执行的"做法"提炼成可复用的 skill 文件，下次类似任务直接召回。

### Claude Code：while + 三类子Agent + 子上下文隔离

```ts
// 接近真实结构的伪代码
while (true) {
  const resp = await claude.chat(messages, { tools: TOOLS });
  if (resp.stop_reason === 'end_turn') break;        // 模型自决结束
  for (const tu of resp.content.filter(x => x.type === 'tool_use')) {
    if (tu.name === 'Agent') {                        // 启动子Agent
      const sub = await spawnSubAgent(tu.input);     // 独立上下文窗口
      messages.push({ role: 'tool_result', content: sub.summary });
    } else {
      const r = await tools[tu.name].run(tu.input);  // 主循环工具
      messages.push({ role: 'tool_result', content: r });
    }
  }
}
```

三类子Agent：Explore（搜索）、Plan（规划）、General-purpose（通用）。子Agent跑在独立窗口，结果摘要回主循环，避免污染主上下文。

### 横向对比

| 维度 | OpenClaw | Hermes | Claude Code |
|---|---|---|---|
| 核心循环 | 单Agent线性 | 单Agent + 并行子Agent | while + 三类子Agent |
| 学习能力 | 无 | 有（自动提炼skill） | 无（靠 CLAUDE.md 人工维护） |
| 复杂任务策略 | Prompt 拆解 | 子Agent并行 | 子Agent独立窗口 |

---

## 三、记忆机制：谁记得最多

### OpenClaw：三文件注入

- `AGENTS.md`：项目规范
- `SOUL.md`：人格/语气
- `TOOLS.md`：工具说明

每次对话把三个文件塞进 System Prompt，中间结果落本地文件。**没有跨会话的语义记忆**，每次都是"新手"。

### Hermes：分层记忆 + 用户建模 + FTS5 检索

- **持久化**：对话历史落 SQLite
- **用户建模**：内置类似 Honcho 的方言式建模，记录用户偏好（待考证：Honcho 是开源项目，Hermes 是否真用了它需看实际仓库）
- **跨会话搜索**：SQLite FTS5 全文搜索历史片段
- **学习闭环**：执行→提炼→存 skill→下次复用

最强项：记忆不只是"记住"，还能**转化为可执行的技能**。

### Claude Code：CLAUDE.md + 文件外化 + 跨项目 ~/.claude/

- **CLAUDE.md**（项目级）：作为**用户消息**而非 System Prompt 注入。这是个安全设计——避免用户自定义指令绕过 Anthropic 的安全规则。支持目录层级（根目录全局，子目录局部）。
- **.claude/ 目录**：当前会话的中间状态外化，Context Reset 后能从文件恢复。
- **~/.claude/**：跨项目的长期偏好。

| 维度 | OpenClaw | Hermes | Claude Code |
|---|---|---|---|
| 工作记忆 | 三文件注入 System Prompt | AGENTS.md + 动态加载 | CLAUDE.md 作为 user message 注入 |
| 长期记忆 | 无 | Honcho 用户建模 + FTS5 | ~/.claude/ + 分层 CLAUDE.md |
| 经验积累 | 无 | 自动 skill 化 | 人工维护 |
| 跨会话 | ❌ | ✅ | ✅（靠文件外化）|

---

## 四、工具调用：谁更可控

### OpenClaw：MCP + 社区市场

工具走 MCP 协议（Model Context Protocol，Anthropic 提出的工具接入标准）。社区有"ClawHub 技能市场"（待考证），下载即用。执行环境用 Docker 沙箱或 SSH 后端隔离。

短板：沙箱级隔离粒度太粗，要么沙箱里全能做，要么全做不了。

### Hermes：MCP + 自动生成技能 + 动态白名单

- 工具协议同样走 MCP
- 技能除了下载，还能自动生成（agentskills.io 标准，待考证）
- **动态白名单**：根据当前任务上下文动态决定哪些工具可见，减少模型选错工具

### Claude Code：18+ 内置工具 + 三级权限

不主走 MCP（虽然支持 MCP Server 接入），核心是**内置工具**，每个工具有严格 schema 和使用规则。五大类：

- 文件：Read / Write / Edit / Glob / Grep
- 执行：Bash / NotebookEdit
- 网络：WebFetch / WebSearch
- Agent：Agent / Skill
- 交互：AskUserQuestion / TodoWrite

权限模型：`deny > ask > allow`，可按"工具 + 路径 + 参数"组合。

```json
// .claude/settings.json 示例
{
  "permissions": {
    "Bash": { "allow": ["git status", "pnpm test"], "deny": ["rm -rf *"], "ask": ["*"] },
    "Write": { "allow": ["src/**"], "ask": ["*"], "deny": [".env", "**/secrets/**"] }
  }
}
```

设计原则：**专用工具优先于通用命令**——能用 Read 就别 cat，能用 Edit 就别 sed。专用工具能做更精细的错误处理和权限校验。

---

## 五、上下文管理：窗口满了怎么办

### OpenClaw：滑动窗口裁剪

按时间裁掉最早对话，简单粗暴。问题是规则文件如果写得太长，会稀释模型注意力。

实践经验：规则文件应做**渐进式披露（Progressive Disclosure）**，主文件保留 100 行左右核心索引，详细规则拆到子文档按需加载。

### Hermes：just-in-time retrieval

- **始终注入**：核心规则、当前任务目标
- **按需加载**：技能详情、历史片段、工具说明
- **FTS5 检索**：根据当前任务从历史里搜最相关片段，只把相关的塞进窗口

### Claude Code：200K 窗口 + 三层压缩 + Context Reset

按优先级排序：
1. System Prompt（约 8.7K Token，不可压缩）
2. 对话历史（最近 N 轮完整保留）
3. 工具结果（大文件自动截断）

接近上限时三层压缩：早期对话→摘要、大文件→关键片段、子Agent结果→只留摘要。

**Context Reset** 是关键设计：压缩仍不够时，**整个上下文窗口丢掉换新的**。前提是状态已外化到文件系统，新窗口从文件恢复"现在到哪一步"。

> 类比：内存泄漏不优化内存，直接重启进程从磁盘恢复。**重启胜过修补。**

---

## 六、安全机制：谁更不容易翻车

### OpenClaw：沙箱隔离

工具跑在 Docker / SSH 后端。粒度只到沙箱级，缺少"读可以写不行"这种细粒度控制。

### Hermes：约束与恢复层

- **约束**：硬编码到代码或 linter 规则，不靠 Prompt
- **校验**：每步输入输出做格式/内容/权限检查
- **恢复**：失败有预案（限流退避、token 不足保存进度）
- 支持 cron 定时自检与自修复

### Claude Code：23 层检查 + Hook 机制

权限链：`deny → ask → allow`，每次工具调用前过完整检查链。

**Hook 是面试常考点**，本质是在工具调用前后插入自定义脚本，把安全规则从"靠模型自觉"变成"靠代码强制":

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "command": "scripts/check-dangerous-cmd.sh" },
      { "matcher": "Write", "command": "scripts/path-policy.sh" }
    ],
    "PostToolUse": [
      { "matcher": "Write", "command": "scripts/scan-secrets.sh" },
      { "matcher": "Bash", "command": "scripts/audit-log.sh" }
    ],
    "Stop": [{ "command": "scripts/session-summary.sh" }]
  }
}
```

一个真实可跑的 PreToolUse Hook 示例（拦截危险 Bash 命令）：

```bash
#!/usr/bin/env bash
# scripts/check-dangerous-cmd.sh
# stdin 是工具调用的 JSON：{ "tool": "Bash", "params": { "command": "..." } }
input="$(cat)"
cmd="$(echo "$input" | jq -r '.params.command')"

# 黑名单：rm -rf、强制 push、关机等
if echo "$cmd" | grep -qE '(rm -rf [^.]|git push -f|shutdown|mkfs)'; then
  echo '{"action":"deny","reason":"blocked dangerous command"}'
  exit 0
fi
echo '{"action":"allow"}'
```

四种事件：`PreToolUse`（拦截/改参/记日志）、`PostToolUse`（检查结果/扫敏感信息）、`Notification`、`Stop`。

为什么 Hook 比 Prompt 约束可靠？模型可能想办法绕过 Prompt，但 Hook 在执行层强制拦截，模型既看不到也改不了。

---

## 七、补充对比：成本与可观测性（原文遗漏）

| 维度 | OpenClaw | Hermes | Claude Code |
|---|---|---|---|
| Token 成本 | 中（三文件注入有冗余） | 低（按需加载，只塞相关片段） | 高（200K 窗口经常打满，子Agent额外消耗）|
| 延迟 | 低（线性单Agent）| 中（FTS5 检索 + 子Agent并行）| 中-高（多层检查 + Hook 脚本）|
| 可观测性 | 基础日志 | LLM 自我督促摘要 | Hook PostToolUse 可写完整审计日志 |
| 调试难度 | 低 | 中（学习闭环引入不确定性）| 中（子Agent上下文隔离要专门看）|

---

## 八、选型建议

按场景：

- 需要**全平台消息覆盖**（微信、飞书、Discord、Telegram 都能用）→ OpenClaw
- 需要**长期运行越用越强**（运维助手、个人知识管理）→ Hermes
- 需要**编程场景的安全可控**（团队协作、生产仓库）→ Claude Code

按团队/技术栈：

| 场景 | 推荐 | 关键原因 |
|---|---|---|
| 个人开发者快速上手 | OpenClaw | 全平台覆盖、社区生态丰富 |
| 想做自进化系统 | Hermes | Learning Loop 是核心竞争力 |
| 企业级编程 | Claude Code | 23层检查 + Hook 最完善 |
| 多Agent协作 | Hermes | 子Agent并行委派 |
| 长链路任务 | Claude Code | Context Reset + 状态外化 |

**三者不冲突**：可以 OpenClaw 做消息入口、Hermes 做后台进化、Claude Code 做代码编辑。Claude Code 也支持 MCP Server，可以接入 OpenClaw 的工具生态。

---

## 九、面试高频追问（精选）

**Q1：三者的共性是什么？为什么放一起比？**
都是 Harness Engineering 的实现，都用 ReAct 循环、都支持 MCP、都做了上下文管理。差异是 Harness 六层组件的侧重不同：OpenClaw 重工具生态，Hermes 重学习闭环，Claude Code 重安全。

**Q2：Hermes 的学习闭环具体怎么做？**
任务结束后从执行轨迹里提炼模式，生成 skill 文件落地到 `~/.hermes/skills/`，下次任务先在 skill 库里检索召回，命中就直接调用并在使用中迭代。优点是"复利"——每次错误都沉淀到环境，环境越来越强。

**Q3：Claude Code 的 Hook 怎么实现？**
在工具调用前后插入自定义脚本。配置写在 `.claude/settings.json`，用 matcher 匹配工具，用 command 指定脚本。四种事件：PreToolUse、PostToolUse、Notification、Stop。脚本通过 stdin 拿到调用上下文，stdout 返回 `{"action":"allow|deny|modify"}`。关键：在代码层强制执行，模型绕不过。

**Q4：CLAUDE.md 为什么不放在 System Prompt？**
安全设计。System Prompt 优先级最高，CLAUDE.md 是用户/项目自定义，如果同级会被用来覆盖安全规则。作为 user message 注入，优先级低于安全规则、高于普通对话，是安全和灵活性的平衡。

**Q5：Context Reset 和上下文压缩什么区别？**
- 压缩：把历史对话压成摘要，腾空间但模型还带"上下文焦虑"（在长上下文里倾向草草收尾）
- Reset：直接换新窗口，从文件系统恢复状态，前提是状态完全外化
策略：先压缩，压缩不够再 Reset。

**Q6：AGENTS.md / CLAUDE.md 越写越长效果反而变差怎么办？**
渐进式披露：主文件保留 100 行左右核心索引，详细规则拆子文档，Agent 按需加载。这是社区共识，Anthropic 的 Agent Skills 也是这思路。

---

## 写在最后

三个框架对应三种演进方向：

> **能干活（工具执行） → 越干越强（自进化） → 干得稳（安全工程化）**

面试别只背名字。理解为什么 Agent 需要这三步演进，比记住框架名重要得多——真实生产里，"能用"不等于"可靠"，"可靠"不等于"可持续"。

---

**版本说明**
- 文中标注 `（待考证）` 的内容请使用前自行核实
