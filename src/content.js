let chromeMsg = require('./util/chromeMsg')
let $ = require('jquery')
import './style/index.css'

let {
    renderSkeleton,
} = require("./skeleton")


chromeMsg.on("createSkeleton", (params) => {
    console.log('createSkeleton')
    const {config, root} = params

    // 默认页面根节点，可以导出某个dom容器的骨架屏结构
    let content = renderSkeleton("body", config)
    console.log(content)
})
