# 部署上线步骤

## 一、首次部署（10 分钟）

### 1. 把骨架推到 GitHub 仓库

```bash
# 在你本地电脑上执行
cd ~/projects   # 或你常用的代码目录

# 克隆你刚建好的空仓库
git clone https://github.com/XiaGu2020/XiaGu2020.github.io.git
cd XiaGu2020.github.io

# 把骨架内容复制进去（路径替换成你 WorkBuddy 工作区的实际路径）
cp -R /Users/lvzeping.a/WorkBuddy/2026-05-09-task-9/blog-skeleton/. ./

# 确保隐藏目录也复制了
ls -la .github docs

# 安装依赖（验证本地能跑）
npm install

# 本地预览
npm run dev
# 浏览器打开 http://localhost:5173 看看效果

# 没问题就 push
git add .
git commit -m "init: VitePress blog skeleton"
git push origin main
```

### 2. 开启 GitHub Pages

1. 浏览器打开仓库：<https://github.com/XiaGu2020/XiaGu2020.github.io>
2. 点 **Settings** 标签
3. 左侧菜单选 **Pages**
4. **Source** 一栏选 **GitHub Actions**（不是 Deploy from branch）
5. 保存

### 3. 等待构建完成

1. 回到仓库首页，点 **Actions** 标签
2. 应该能看到一个正在跑的 workflow（"Deploy VitePress site to Pages"）
3. 等绿色对勾出来（约 1-2 分钟）
4. 浏览器打开 <https://xiagu2020.github.io>，搞定

## 二、日常更新

```bash
# 1. 在分类目录下写新文章
vim docs/tech/my-new-post.md

# 2. 在 docs/.vitepress/config.mts 的 sidebar 加入新文章链接
# 3. 在该分类的 index.md 文章列表里加一条

# 4. 本地预览确认
npm run dev

# 5. push 上线
git add .
git commit -m "新文章: my-new-post"
git push

# Actions 自动跑，1-2 分钟后线上更新
```

## 三、常见问题

### Q1: push 后 Actions 失败？

去 Actions 标签点开报错的那次运行，最常见的原因：
- `npm ci` 失败 → 删本地 `package-lock.json`，重新 `npm install` 后 push
- 权限错误 → 检查 Settings → Pages → Source 是不是选了 GitHub Actions

### Q2: 站点 404 / 空白？

- 仓库名必须严格是 `XiaGu2020.github.io`（区分大小写要跟用户名一致）
- `config.mts` 里的 `base` 必须是 `'/'`（个人主页站点）
- 等 5 分钟后再访问，DNS / CDN 有时候慢

### Q3: 想绑自己域名？

- 买个域名（阿里云 / Namecheap，几十块/年）
- 仓库 Settings → Pages → Custom domain 填你的域名
- 在 docs/public/ 下加一个 `CNAME` 文件，里面写你的域名
- 域名服务商加一条 CNAME 记录指向 `xiagu2020.github.io`

### Q4: 想加评论功能？

推荐 **Giscus**（基于 GitHub Discussions）：
1. 仓库 Settings → General → Features → 勾上 Discussions
2. 去 <https://giscus.app/zh-CN> 配置，拿到嵌入代码
3. 在 `docs/.vitepress/theme/` 里写一个评论组件，挂到布局上

需要的时候我再给你写完整代码。
