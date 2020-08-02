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
let renderInput = require('./strategy/input')
let renderIgnore = require('./strategy/ignore')

let {SKELETON_TYPE, KEY, KEY_EXCLUDE} = require('./strategy/enum')
const {IGNORE, TEXT, IMAGE, BLOCK, BORDER, LIST, BUTTON, BACKGROUND_IMAGE, INPUT} = SKELETON_TYPE

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
    let re = /url/ // 处理背景图片
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

function isInput(node) {
    if (node.tagName === 'INPUT') {
        let type = node.getAttribute("type")
        return ['text', 'password', 'search'].includes(type)
    }
    return false
}

function getNodeSkeletonType($dom) {
    let node = $dom[0]
    if (!node) return

    // 按照常见优先级指定对应type
    if (isInput(node)) {
        return INPUT
    }

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

function replaceTextNode($dom) {
    let type = $dom.attr(KEY)
    if (type === TEXT) return
    // 文本节点
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

// 遍历DOM，根据节点类型执行对应的渲染逻辑
function preorder($dom) {
    replaceTextNode($dom)

    // 元素节点
    $dom.children().each(function () {
        let $this = $(this);
        let type = $this.attr(KEY) || getNodeSkeletonType($this)  // 自动检测节点类型，并附上type
        let excludeType = $this.attr(KEY_EXCLUDE)

        if (!excludeType || type !== excludeType) {
            let node = $this[0]
            if (!node) return

            let handlers = {
                [TEXT]: renderText,
                [IMAGE]: renderImg,
                [BLOCK]: renderBlock,
                [BORDER]: renderBorder,
                [BUTTON]: renderButton,
                [LIST]: renderList,
                [BACKGROUND_IMAGE]: renderBackgroundImage,
                [INPUT]: renderInput,
                [IGNORE]: renderIgnore
            }

            let handler = handlers[type]
            handler && handler($this)
        }

        // 递归
        preorder($this)
    });

}

function preset(config) {
    let {code, selector, ignore} = config

    // 提前设置一些类型参数
    for (let key of Object.keys(selector)) {
        const {include, exclude} = selector[key]
        include && $(include).attr(KEY, key)
        exclude && $(exclude).attr(KEY_EXCLUDE, key)
    }

    ignore && $(ignore).attr(KEY, IGNORE)

    // TODO 貌似不需要提供自动运行代码的接口
    if (code) {
        try {
            eval(code)
        } catch (e) {
            console.log(e)
        }
    }
}

// todo 一些初始化操作
function renderSkeleton($dom, config) {
    $dom.addClass("sk")

    preset(config)

    preorder($dom)
}

module.exports = {
    renderSkeleton,
    SKELETON_TYPE,
    KEY
}
