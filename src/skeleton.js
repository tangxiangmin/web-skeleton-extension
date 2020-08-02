/**
 * 2019/1/16 上午11:08
 */

let $ = require('jquery')

let renderText = require('./strategy/text')
let renderImg = require('./strategy/img')
let renderBlock = require('./strategy/block')
let renderBorder = require('./strategy/border')
let renderButton = require('./strategy/button')
let renderList = require('./strategy/list')
let renderBackgroundImage = require('./strategy/backgroundImage')

let {SKELETON_TYPE, KEY} = require('./strategy/enum')
const {TEXT, IMAGE, BLOCK, BORDER, LIST, BUTTON, BACKGROUND_IMAGE} = SKELETON_TYPE

function checkNodeVisible(node) {
    // https://segmentfault.com/q/1010000020091228
    // todo 校验各种不可见的情况
    return node.style.display !== 'none'
}

function hasBorder($node) {
    let style = $node.css("border-width")
    return style && style !== '0px'
}

function hasBackgroundImage($node) {
    let re = /\.(jpeg|jpg|png|gif|svg|webp)/
    let background = $node.css("background")
    return re.test(background)
}

function isImage(node) {
    return node.tagName === "IMG"
}

function isList(node) {
    return node.children.length > 0 && /UL|OL/.test(node.tagName)
}

function isText(node) {
    return node.childNodes &&
        // node.childNodes.length === 1 &&
        node.childNodes[0] && node.childNodes[0].nodeType === 3 &&
        /\S/.test(node.childNodes[0].textContent)
}

function isButton(node) {
    // todo 需要按照规范编写语义化的代码
    return node.nodeType === 1 &&
        (node.tagName === 'BUTTON' || (node.tagName === 'A' && node.getAttribute('role') === 'button'))
}

function getNodeSkeletonType($dom) {
    let node = $dom[0]
    if (!node) return

    if (hasBorder($dom)) {
        return BORDER
    }
    if (hasBackgroundImage($dom)) {
        return BACKGROUND_IMAGE
    }

    if (isImage(node)) {
        return IMAGE
    }
    if (isList(node)) {
        return LIST
    }

    if (isButton(node)) {
        return BUTTON
    }

    // 把文本节点处理放在最后面
    if (isText(node)) {
        // return TEXT
    }

}

// 遍历DOM，根据节点类型执行对应的渲染逻辑
function preorder($dom) {

    let type = $dom.attr(KEY)
    // 文本接单
    if (type !== TEXT) {
        let $texts = $dom.contents().filter(function () {
            return this.nodeType === 3; // 文本节点
        })
        $texts.each(function () {
            let node = this
            let $this = $(this)
            // 过滤空文本
            if (!$this.text().trim()) {
                return
            }
            // 使用一个内联元素包裹起来，方便渲染对应宽度的背景颜色
            let span = document.createElement('span')

            let $span = $(span)
            $span.attr(KEY, TEXT)
            $span.insertAfter($this)
            $this.remove()

            span.appendChild(node)

        })
    }

    // 元素节点
    $dom.children().each(function () {
        let $this = $(this);
        let type = $this.attr(KEY) || getNodeSkeletonType($this)  // 自动检测节点类型，并附上type

        let node = $this[0]
        if (!node) return

        let handlers = {
            [TEXT]: renderText,
            [IMAGE]: renderImg,
            [BLOCK]: renderBlock,
            [BORDER]: renderBorder,
            [BUTTON]: renderButton,
            [LIST]: renderList,
            [BACKGROUND_IMAGE]: renderBackgroundImage
        }

        let handler = handlers[type]
        handler && handler($this)

        // 递归
        preorder($this)
    });

}

// todo 一些初始化操作
function renderSkeleton($dom) {
    preorder($dom)
}

module.exports = {
    renderSkeleton,
    SKELETON_TYPE,
    KEY
}
