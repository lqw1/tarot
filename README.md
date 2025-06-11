# ENV

`.local.env` 是本地 localhost 的环境变量
`.env.development` 是 dev 环境的环境变量
`.env.test` 是 test 环境的环境变量
`.env.prod` 是 prod 环境的环境变量

# How to Set base router name for history router

1. 在`package.json`中设置`homepage`
2. 在`App.tsx`中设置`basename`

# Project Structure

```
└── /src
    ├── /layout  //页面的总体布局
    ├── /pages  //页面，其中每个文件夹按照功能模块划分
    ├── /components //组件，分为 common 及业务组件
    ├── /services //api请求
    ├── /language //i18n
    ├── /routers //路由管理
    ├── /store //状态管理逻辑相关
    ├── /utils //常量、工具函数等
    ├── /types //TS 存放类型
    ├── /assets //静态资源
    ├── /tests //测试相关
    ├── index.ts
    └── App.ts
```

# Api Proxy

`setupProxy.js` 中设置了代理，可以自己根据项目配置 api 代理