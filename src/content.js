import chromeMsg from './util/chromeMsg.js'
import './style/index.css'

import {
    renderSkeleton,
} from './skeleton.js'


chromeMsg.on("createSkeleton", (params) => {
    console.log('createSkeleton')
    const {config, root} = params

    // 默认页面根节点，可以导出某个dom容器的骨架屏结构
    let content = renderSkeleton(root || "body", config)
    console.log(content)
})
