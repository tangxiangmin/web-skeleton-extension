import style from './style/index.css'


let $ = require('jquery')

let {
    renderSkeleton,
} = require("./skeleton")

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
// renderSkeleton($("body"))

let body = $("body")
// walk(body[0])
$(".btn").on("click", () => {
    renderSkeleton(body)
})


