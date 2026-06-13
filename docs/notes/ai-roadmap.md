---
title: 2026 AI 工程转型学习路线
description: 一个后端工程师从零到生产的 AI 大模型学习路径，6 阶段 21 周，含 6 份完整教材 + 145 道面试题
date: 2026-06-13
tags: [AI, 大模型, 学习路线, 转型]
---

# 2026 AI 工程转型学习路线

> 一个 7 年后端工程师，2026 年从零开始的大模型工程化学习计划。
> 总共 **6 阶段 / 21 周 / ~25 万字 / 71 章 / 145 道面试题**。

整套资料以独立 HTML 形式发布，**暗色主题 + 左侧锚点导航**，每章按 **原理 → 代码 → 易踩坑 → 面试连接 → P8/P9 升维** 五段式组织。

::: tip 阅读方式
所有教材链接都会**在新窗口打开**——这套资料是独立 HTML 产物（暗色主题 + 自定义布局），不走 VitePress 主题。
:::

## 入口

| 类型 | 内容 | 链接 |
|---|---|---|
| 学习中心 | 9 份资料统一导航页（推荐先看这个） | <a href="/aikb/index.html" target="_blank" rel="noopener">打开 →</a> |
| 总览大纲 | 6 阶段路径 + 输出物清单（10 分钟读完） | <a href="/aikb/ai-2026-learning-plan-laoli.html" target="_blank" rel="noopener">打开 →</a> |
| 21 周排期 | 周次甘特图 + 每周交付物 | <a href="/aikb/ai-2026-schedule-21weeks.html" target="_blank" rel="noopener">打开 →</a> |

## 6 份完整教材

| 阶段 | 主题 | 核心能力 | 链接 |
|---|---|---|---|
| Phase 0 | Python × LLM 工程基础 | 异步 / Pydantic / OpenAI SDK / 流式输出 | <a href="/aikb/phase0-python-llm-handbook.html" target="_blank" rel="noopener">打开 →</a> |
| Phase 1 | Transformer 与基座模型 | Attention / 位置编码 / 训练范式 / 推理量化 | <a href="/aikb/phase1-transformer-handbook.html" target="_blank" rel="noopener">打开 →</a> |
| Phase 2 | RAG 检索增强生成 | 切块 / Embedding / 向量库 / 重排 / 评估 | <a href="/aikb/phase2-rag-handbook.html" target="_blank" rel="noopener">打开 →</a> |
| Phase 3 | Agent 智能体工程 | ReAct / Function Calling / 多 Agent / 记忆 | <a href="/aikb/phase3-agent-handbook.html" target="_blank" rel="noopener">打开 →</a> |
| Phase 4 | 推理性能与部署 | vLLM / TensorRT-LLM / KV Cache / 量化 / 延迟优化 | <a href="/aikb/phase4-inference-handbook.html" target="_blank" rel="noopener">打开 →</a> |
| Phase 5 | 系统设计与面试 | 高并发 LLM 服务 / 成本治理 / 故障预案 / P8/P9 答题模板 | <a href="/aikb/phase5-system-design-handbook.html" target="_blank" rel="noopener">打开 →</a> |

## 这套资料适合谁

- **3-8 年后端工程师**，想转 AI 工程 / 智能审核 / 推荐策略方向
- 不需要从 0 学 ML 数学，但需要把"模型当成一个高并发服务"来设计的工程视角
- 准备 **P7 → P8** 晋升答辩，或外面大厂 **AI Infra / LLM 应用** 面试

## 为什么是 6 个阶段

```
Phase 0  →  把 Python 异步、Pydantic、OpenAI SDK 用熟（2 周）
Phase 1  →  能看懂 Transformer 论文，知道 LoRA / SFT / DPO 的边界（3 周）
Phase 2  →  RAG 全链路自己跑通一遍 + 会做评估（4 周）
Phase 3  →  Agent 框架横评 + 自己写一个 mini Agent（4 周）
Phase 4  →  vLLM 部署 + 量化 + 性能压测（4 周）
Phase 5  →  能在白板上画出"千万级 LLM 服务"架构（4 周）
```

## 配套产出

- 6 份教材，每份独立可读（不依赖前置阶段也能查）
- 145 道面试题，覆盖**原理理解 / 工程取舍 / 系统设计 / 故障复盘**四类
- 每章 P8/P9 升维段落，把"会用"提到"能讲清楚为什么这么设计"

## 后续计划

- [ ] 每周一篇学习周报，沉淀到 [技术分类](/tech/)
- [ ] 把 Phase 2 RAG 部分跑通后开源到 GitHub
- [ ] 完成 Phase 5 后整理一篇《后端 7 年转 AI 工程的 30 个真实坑》

---

> 资料持续更新中，最新内容以学习中心入口页为准。如有错漏欢迎在 <a href="https://github.com/XiaGu2020/XiaGu2020.github.io/issues" target="_blank" rel="noopener">GitHub</a> 提 issue。
