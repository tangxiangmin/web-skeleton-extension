import './style/index.css'
import {renderSkeleton} from './skeleton.js'

const source = document.querySelector('#source-root')
const preview = document.querySelector('#preview-root')
const output = document.querySelector('#html-output')
const status = document.querySelector('#generation-status')
const verification = document.querySelector('#verification-status')

function clearResult() {
    preview.replaceChildren()
    output.value = ''
    status.textContent = ''
    verification.textContent = ''
}

function inspectResult(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let remainingText = false
    while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim()) remainingText = true
    }
    const checks = [
        ['非空文字已清理', !remainingText],
        ['链接地址已清理', !root.querySelector('a[href], a[ping]')],
        ['常见文案属性已清理', !root.querySelector('[title], [alt], [placeholder], [value], [aria-label], [aria-description]')],
        ['表单当前值已清理', Array.from(root.querySelectorAll('input, textarea')).every(node => node.value === '')]
    ]
    verification.textContent = checks.map(([label, passed]) => `${passed ? '通过' : '未通过'}：${label}`).join('\n')
}

function generate() {
    clearResult()
    const root = source.cloneNode(true)
    root.removeAttribute('id')
    // 先挂载以取得真实布局尺寸，再调用与扩展相同的核心模块。
    preview.append(root)
    try {
        renderSkeleton(root)
        output.value = root.outerHTML
        inspectResult(root)
        status.textContent = '已生成，可查看预览及 HTML。'
    } catch (error) {
        status.textContent = `生成失败：${error instanceof Error ? error.message : String(error)}`
    }
}

document.querySelector('#generate-button').addEventListener('click', generate)
document.querySelector('#reset-button').addEventListener('click', clearResult)
