web骨架屏
===

通过chrome扩展程序，向页面注入代码，解析dom，替换样式，生成骨架屏，最后导出对应的html文件

参考
* [page-skeleton-webpack-plugin](https://github.com/ElemeFE/page-skeleton-webpack-plugin)
* [一种自动化生成骨架屏的方案](https://github.com/Jocs/jocs.github.io/issues/22)


相关整理：[使用Chrome扩展程序生成网页骨架屏](https://www.shymean.com/article/使用Chrome扩展程序生成网页骨架屏)

本插件已经上架到[Chrome应用商店](https://chrome.google.com/webstore/detail/web-skeleton/cnbfholcpekcobijhgkjcmlceomfdpck)

## 开发环境

工程使用 PNPM、Vite 和 `@crxjs/vite-plugin`，扩展清单为 Manifest V3。
需要 Node.js 22.12+，使用本机已安装的 PNPM，不固定 PNPM 版本；popup 使用原生 JavaScript、DOM 和 CSS；骨架屏处理逻辑使用 jQuery。

首次安装依赖，由开发者执行：

```sh
pnpm install
```

安装后会生成 `pnpm-lock.yaml`，请将其纳入版本管理。

开发扩展：

```sh
pnpm dev
```

在 Chrome 中打开 `chrome://extensions/`，启用开发者模式，点击“加载已解压的扩展程序”，选择项目根目录下的 `dist` 目录。
开发时保持 Vite 服务运行，CRXJS 提供热更新；修改扩展清单后应重新加载扩展。
首次加载扩展后刷新目标页面，再通过扩展图标打开 popup。

本地网页调试：

```sh
pnpm serve
```

调试页面位于 `examples/`，地址为 `http://127.0.0.1:9000/examples/index.html`，点击页面按钮调用骨架屏生成逻辑。
`pnpm dev` 和 `pnpm serve` 使用同一个开发服务，选择其中一个运行即可。

生产构建与本地压缩：

```sh
pnpm build
pnpm zip
```

`pnpm build` 输出到根目录 `dist`，将该目录加载为扩展。
`pnpm zip` 先执行生产构建，再使用系统 `zip` 命令将 `dist` 内容压缩为根目录 `skeleton.zip`。
生产构建仅包含扩展入口，本地调试页面不进入生产包。全部产物保留在本地。

配置中的 `ignore`、`selector` 继续用于节点选择；历史 `config.code` 使用 `eval`，受 Manifest V3 的 CSP 限制，不能作为脚本执行入口。

## Feature
* [ ] 移动端屏幕适配
* [ ] 浏览器默认字体样式、行高等处理
* [ ] 扩展需要标记的元素节点
* [ ] 提供扩展程序、JS库等多种使用方式

todo
* [ ] 优化生成代码体积


## 使用约定
需要使用一些语义化的标签
* 按钮需要使用button或者a标签上指定role="button"

## 生成思路
将页面划分成不同的部件，通过自定义属性`skeleton-type`设置该部件需要展示的状态，最后从根节点遍历，依次为各个部件添加骨架屏的样式，最后导出带样式的骨架屏html文件

整个工具依赖`skeleton-type`类型，控制该渲染类型的手段有
* 开发时通过源码直接写在页面结构上
* 打开Chrome开发者工具，通过Console或者Elements面板直接修改
* 若未指定，工具会根据dom类型和内容自行推断渲染类型
