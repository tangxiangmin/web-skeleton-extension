web骨架屏
===

通过chrome扩展程序，向页面注入代码，解析dom，替换样式，生成骨架屏，最后导出对应的html文件

参考
* [page-skeleton-webpack-plugin](https://github.com/ElemeFE/page-skeleton-webpack-plugin)
* [一种自动化生成骨架屏的方案](https://github.com/Jocs/jocs.github.io/issues/22)


相关整理：[使用Chrome扩展程序生成网页骨架屏](https://www.shymean.com/article/使用Chrome扩展程序生成网页骨架屏)

本插件已经上架到[Chrome应用商店](https://chrome.google.com/webstore/detail/web-skeleton/cnbfholcpekcobijhgkjcmlceomfdpck)

## 开发环境

将扩展程序根目录指向src目录，执行`npm run dev`

本地网页调试直接使用`npm run serve`开启调试

关于Chrome加载本地插件的具体步骤

* Chrome浏览器输入地址 `chrome://extensions/`
* 打开右上角的"开发者模式"

![](http://img.shymean.com/oPic/1607419485662_967.png)

* 点击"加载已解压的本地文件"，选中当前项目的src目录作为插件地址

![](http://img.shymean.com/oPic/1607419583847_780.png)

然后再chrome的插件列表中启用插件，Chrome右上角会出现插件图标，点击图标会出现popup操作页面，然后就可以用Chrome打开`src/index.html`开始调试了

![](http://img.shymean.com/oPic/1607420362178_824.png)

需要注意的是修改`content.js`后需要手动reload插件一下，相关改动才会生效

![](http://img.shymean.com/oPic/1607419716677_473.png)


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


