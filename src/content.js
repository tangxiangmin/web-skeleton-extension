let chromeMsg = require('./util/chromeMsg')
let $ = require('jquery')
import './style/index.css'

let {
    renderSkeleton,
} = require("./skeleton")


chromeMsg.on("createSkeleton", (params) => {
    console.log('createSkeleton')
    //
    // let {code, block, image, text, border} = params
    //
    // $(block).attr(KEY, SKELETON_TYPE.BLOCK)
    // $(image).attr(KEY, SKELETON_TYPE.IMAGE)
    // $(text).attr(KEY, SKELETON_TYPE.TEXT)
    // $(border).attr(KEY, SKELETON_TYPE.BORDER)
    //
    // try {
    //     eval(code)
    // } catch (e) {
    //     console.log(e)
    // }

    // 默认页面根节点，可以导出某个dom容器的骨架屏结构
    renderSkeleton($("body"))
})


