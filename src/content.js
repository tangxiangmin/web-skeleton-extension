let chromeMsg = require('./util/chromeMsg')
let $ = require('jquery')

let {
    renderSkeleton,
    SKELETON_TYPE,
    KEY
} = require("./skeleton")

chromeMsg.on("createSkeleton", () => {
    // TODO 测试代码，此处可手动设置skeleton_type类型，未设置则在renderSkeleton中自动推断
    // $(".test").attr(KEY, SKELETON_TYPE.BLOCK)
    $(".wrap1").attr(KEY, SKELETON_TYPE.TEXT)
    $(".logo").attr(KEY, SKELETON_TYPE.IMAGE)
    $(".nav_item").attr(KEY, SKELETON_TYPE.TEXT)

    let $target = $(".media")
    $target.attr(KEY, SKELETON_TYPE.BORDER)
    $target.find(".media_tt, .media_ct, .text-red").attr(KEY, SKELETON_TYPE.TEXT)
    $target.find(".media_img").attr(KEY, SKELETON_TYPE.IMAGE);

    $(".list").find(".list_item").attr(KEY, SKELETON_TYPE.TEXT)

    // 默认页面根节点，可以导出某个dom容器的骨架屏结构
    renderSkeleton($("body"))
})


