import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '老李的博客',
  description: '一个后端工程师的技术、项目、读书与生活笔记',

  // 部署到 https://xiagu2020.github.io，base 用根路径
  base: '/',

  // 头部
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: '老李 (XiaGu)' }],
    ['meta', { name: 'keywords', content: '后端,AI,内容审核,Agent,Vue,读书,育儿' }]
  ],

  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    // logo: '/logo.png',  // 想加 logo 时取消注释，把 logo.png 放进 docs/public/
    siteTitle: '老李的博客',

    // 顶部导航（顺序：技术 → 项目 → 读书 → 随笔）
    nav: [
      { text: '首页', link: '/' },
      { text: '技术', link: '/tech/', activeMatch: '/tech/' },
      { text: '项目', link: '/lab/', activeMatch: '/lab/' },
      { text: '读书', link: '/notes/', activeMatch: '/notes/' },
      { text: '随笔', link: '/essay/', activeMatch: '/essay/' },
      { text: '关于', link: '/about' }
    ],

    // 侧边栏（按分类配置，顺序对齐 nav）
    sidebar: {
      '/tech/': [
        {
          text: '技术',
          items: [
            { text: '分类首页', link: '/tech/' },
            { text: '三个Agent粗评', link: '/tech/agent-frameworks-comparison.md' }
          
          ]
        }
      ],
      '/lab/': [
        {
          text: '项目',
          items: [
            { text: '分类首页', link: '/lab/' },
            { text: 'Stock Advisor 开发记录', link: '/lab/stock-advisor-dev' }
          ]
        }
      ],
      '/notes/': [
        {
          text: '读书',
          items: [
            { text: '分类首页', link: '/notes/' }
          ]
        }
      ],
      '/essay/': [
        {
          text: '随笔',
          items: [
            { text: '分类首页', link: '/essay/' },
            { text: '迎接小生命', link: '/essay/welcome-baby' },
            { text: '新生儿育儿SOP', link: '/essay/newborn-care-guide' }
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
