/**
 * 2019/1/16 上午11:08
 */

import $ from 'jquery'

import renderText from './strategy/text.js'
import renderImg from './strategy/img.js'
import renderBlock from './strategy/block.js'
import renderBorder from './strategy/border.js'
import renderButton from './strategy/button.js'
import renderList from './strategy/list.js'
import renderBackgroundImage from './strategy/backgroundImage.js'
import renderInput from './strategy/input.js'
import renderIgnore from './strategy/ignore.js'

import {SKELETON_TYPE, KEY, KEY_EXCLUDE} from './strategy/enum.js'
const {IGNORE, TEXT, IMAGE, BLOCK, BORDER, LIST, BUTTON, BACKGROUND_IMAGE, INPUT} = SKELETON_TYPE


function inViewPort(node) {
    const rect = node.getBoundingClientRect()
    return rect.top < window.innerHeight && rect.left < window.innerWidth
}

function checkNodeVisible($node) {
    // https://segmentfault.com/q/1010000020091228
    // todo 校验各种不可见的情况

    return $node.css('display') !== 'none'
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
    if (node.tagName === 'TEXTAREA') return true
    if (node.tagName === 'INPUT') {
        let type = node.type
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

    if (isButton(node)) {
        return BUTTON
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

    // 把文本节点处理放在最后面
    if (isText(node)) {
        // return TEXT
    }
}

function replaceTextNode($dom) {
    let type = $dom.attr(KEY)
    // 控件内容由自身渲染逻辑和最终清理处理，避免插入 span 改变原生布局。
    if (type === TEXT || isInput($dom[0]) || isButton($dom[0])) return
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

function replaceOpaqueElements($root) {
    const roots = $root.toArray()
    const properties = [
        'display', 'box-sizing', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'font-size', 'font-family', 'font-weight', 'line-height', 'letter-spacing',
        'vertical-align', 'text-align', 'border-radius',
        'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
        'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
        'position', 'top', 'right', 'bottom', 'left', 'float', 'clear',
        'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order',
        'grid-area', 'justify-self', 'visibility'
    ]
    // 先测量全部占位对象；替换父节点时，其内部节点一并丢弃。
    const components = $root.find('*').addBack().toArray().filter(node =>
        (node.namespaceURI === 'http://www.w3.org/2000/svg' && node.localName === 'svg') ||
        (node.namespaceURI === 'http://www.w3.org/1999/xhtml' &&
            node.localName.includes('-') && !node.hasAttribute(KEY))
    ).map(node => {
        const computed = window.getComputedStyle(node)
        const style = {}
        for (const property of properties) style[property] = computed.getPropertyValue(property)
        return {node, style, width: $(node).width(), height: $(node).height(), isSvg: node.localName === 'svg'}
    })

    for (const {node, style, width, height, isSvg} of components) {
        if (!roots.some(root => root === node || root.contains(node))) continue
        const replacement = document.createElement('span')
        replacement.className = node.getAttribute('class') || ''
        replacement.setAttribute(KEY, isSvg ? BLOCK : TEXT)
        const exclude = node.getAttribute(KEY_EXCLUDE)
        if (exclude) replacement.setAttribute(KEY_EXCLUDE, exclude)
        if (!isSvg) replacement.textContent = '\u00a0'
        const $replacement = $(replacement)
        $replacement.css(style)
        if (style.display === 'inline') $replacement.css('display', 'inline-block')
        $replacement.width(width).height(height)
        if (isSvg) {
            replacement.style.setProperty('background', '#eee', 'important')
            replacement.style.setProperty('border-color', 'transparent', 'important')
            replacement.style.setProperty('border-radius', '2px', 'important')
        }
        // 不保留组件标签、Shadow DOM、事件或业务属性，避免组件重新渲染。
        node.replaceWith(replacement)
        const index = roots.indexOf(node)
        if (index !== -1) roots[index] = replacement
    }
    return $(roots)
}

// 遍历DOM，根据节点类型执行对应的渲染逻辑
function preorder($dom) {
    replaceTextNode($dom)

    // 排除不可见的元素
    if (!checkNodeVisible($dom)) {
        return
    }

    let type = $dom.attr(KEY) || getNodeSkeletonType($dom)  // 自动检测节点类型，并附上type
    let excludeType = $dom.attr(KEY_EXCLUDE)

    if (!excludeType || type !== excludeType) {
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
        handler && handler($dom)
        // 不再执行后面的模块
        if ([BLOCK].includes(type)) {
            return
        }
    }

    // 元素节点
    $dom.children().each(function () {
        const $this = $(this)
        // 递归
        preorder($this)
    });

}

function preset(config) {
    let {code, selector = {}, ignore} = config

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
function sanitizeSkeleton($root) {
    const roots = $root.toArray()
    const elements = $root.find('*').addBack().toArray()

    // 在替换任何文字之前统一测量，避免前面的替换影响后续节点尺寸。
    const sizes = elements.filter(node =>
        node.classList.contains('sk-text') ||
        Array.from(node.childNodes).some(child => child.nodeType === 3 && child.textContent.trim())
    ).filter(node => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA'].includes(node.tagName))
        .map(node => ({ node, width: $(node).width(), height: $(node).height() }))

    for (const {node, width, height} of sizes) {
        const $node = $(node)
        if ($node.css('display') === 'inline') $node.css('display', 'inline-block')
        $node.width(width).height(height)
    }

    for (const node of elements) {
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(node.tagName)) {
            node.remove()
            continue
        }
        if (node.tagName === 'A') {
            node.removeAttribute('href')
            node.removeAttribute('ping')
        }
        for (const attribute of ['title', 'alt', 'placeholder', 'value', 'aria-label', 'aria-description']) {
            node.removeAttribute(attribute)
        }
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') node.value = ''
        if (node.tagName === 'TEXTAREA') node.textContent = ''
    }

    for (const root of roots) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT)
        const nodes = []
        while (walker.nextNode()) nodes.push(walker.currentNode)
        for (const node of nodes) {
            if (node.nodeType === 8) node.remove()
            else if (node.textContent.trim()) node.textContent = '\u00a0'
        }
    }
}

function renderSkeleton(sel, config = {}) {
    let $root = $(sel)
    $root.addClass("sk")

    preset(config)

    $root = replaceOpaqueElements($root)

    preorder($root)

    sanitizeSkeleton($root)

    return $root.html()
}

export {renderSkeleton}
