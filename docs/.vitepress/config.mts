import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '老李的博客',
  description: '一个后端工程师的技术与生活笔记',

  // 部署到 https://xiagu2020.github.io，base 用根路径
  base: '/',

  // 头部
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: '老李 (XiaGu)' }],
    ['meta', { name: 'keywords', content: '后端,AI,内容审核,Vue,Agent,网文,生活' }]
  ],

  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    // logo: '/logo.png',  // 想加 logo 时取消注释，把 logo.png 放进 docs/public/
    siteTitle: '老李的博客',

    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '技术', link: '/tech/', activeMatch: '/tech/' },
      { text: '随笔', link: '/essay/', activeMatch: '/essay/' },
      { text: '关于', link: '/about' }
    ],

    // 侧边栏（按分类配置）
    sidebar: {
      '/tech/': [
        {
          text: '技术',
          items: [
            { text: '分类首页', link: '/tech/' },
            { text: '三大Agent框架横评 OpenClaw / Hermes / Claude Code', link: '/tech/agent-frameworks-comparison' },
            { text: 'Stock Advisor 开发记录', link: '/tech/stock-advisor-dev' }
          ]
        }
      ],
      '/essay/': [
        {
          text: '随笔',
          items: [
            { text: '分类首页', link: '/essay/' },
            { text: '迎接小生命', link: '/essay/welcome-baby' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/XiaGu2020' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 XiaGu (老李)'
    },

    // 中文化
    outline: { label: '本页内容', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',

    // 本地搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  }
})
