# XiaGu2020.github.io

老李的个人博客 —— 技术、投资、随笔。

在线访问：<https://xiagu2020.github.io>

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- GitHub Pages - 部署
- GitHub Actions - 自动构建与发布

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
.
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署
├── docs/
│   ├── .vitepress/config.mts      # 站点配置（导航、侧边栏、主题）
│   ├── public/                    # 静态资源（图片、favicon）
│   ├── index.md                   # 首页
│   ├── about.md                   # 关于
│   ├── tech/                      # 技术分类
│   │   ├── index.md
│   │   └── stock-advisor-dev.md
│   ├── invest/                    # 投资分类
│   │   ├── index.md
│   │   └── portfolio-principles.md
│   └── essay/                     # 随笔分类
│       ├── index.md
│       └── welcome-baby.md
├── package.json
└── README.md
```

## 写新文章

1. 在对应分类目录（`docs/tech/`、`docs/invest/`、`docs/essay/`）下新建 `xxx.md`
2. 在 `docs/.vitepress/config.mts` 的 `sidebar` 配置里把新文章加进去
3. 在该分类的 `index.md` 文章列表里也加一条
4. `git add . && git commit -m "新文章: xxx" && git push`
5. 等 1-2 分钟，GitHub Actions 自动部署到线上

## 协议

- 内容（`docs/` 目录下所有 markdown）：CC BY-NC-SA 4.0
- 代码（配置、模板）：MIT
