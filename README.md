
💿 Overview
----
本项目是2024年春数据库课程设计，基于开源的 [Ant-Design-Vue-Pro](https://github.com/vueComponent/ant-design-vue-pro
) 项目开发，配合Marine-Species-Retrieval-Backend中的后端代码以及数据库架构使用。fork 这个项目主要是想学一下 vue 中路由配置和用户权限的动态管理。原 Ant-Design-Vue-Pro 项目已搭建的十分完备，只是缺乏后端代码。该版本根据自己的理解修改了小部分参数并添加了后端（关联仓库 [Marine-Species-Retrieval-Backend](https://github.com/BlossomsGarden/Marine-Species-Retrieval-Backend)），也是方便自己之后需要搭建网页的情景。


管理员视图展示

<img src="https://github.com/BlossomsGarden/Marine-Species-Retrieval-DB/assets/110208412/95b6e0ff-3878-4015-a097-6ba7f996da86" width="600px">


用户视图展示

<img src="https://github.com/BlossomsGarden/Marine-Species-Retrieval-DB/assets/110208412/b7706413-cb14-4507-82ac-5ff97d30b18d" width="600px">



👨‍💻 环境和依赖
----

- node
- yarn
- webpack
- eslint
- @vue/cli
- [ant-design-vue@1.x](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现



🔧 运行
----

由于 fork 的原项目 Ant-Design-Vue-Pro 没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于库已经升级版本而引入了新版本所导致的问题。所以还是推荐使用者下载 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以获取与如上演示时完全相同的依赖版本 (依据yarn.lock)

- 安装依赖
```
yarn install
```

- 编译项目
```
yarn run build
```

- 开发模式运行
```
yarn run serve
```

执行完毕后依据命令行给出的提示，打开浏览器输入端口号即可访问网页~

