const form = document.querySelector('#skeleton-form')
const rootInput = document.querySelector('#root-selector')
const configInput = document.querySelector('#config-json')
const generateButton = document.querySelector('#generate-button')
const status = document.querySelector('#form-status')

configInput.value = JSON.stringify({
    ignore: '',
    selector: {
        block: { include: '' },
        list: { exclude: '' },
        button: {}
    }
}, null, 2)

function showStatus(message, isError = false) {
    status.textContent = message
    status.classList.toggle('is-error', isError)
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function readConfig() {
    let config
    try {
        config = JSON.parse(configInput.value.trim() || '{}')
    } catch {
        throw new Error('配置项 JSON 格式错误，请检查引号、逗号和括号。')
    }
    if (!isObject(config)) {
        throw new Error('配置项必须是 JSON 对象。')
    }
    if (config.ignore !== undefined && typeof config.ignore !== 'string') {
        throw new Error('ignore 必须是选择器字符串。')
    }
    if (config.selector !== undefined) {
        if (!isObject(config.selector)) {
            throw new Error('selector 必须是 JSON 对象。')
        }
        for (const [type, options] of Object.entries(config.selector)) {
            if (!isObject(options)) {
                throw new Error(`selector.${type} 必须是 JSON 对象。`)
            }
            for (const key of ['include', 'exclude']) {
                if (options[key] !== undefined && typeof options[key] !== 'string') {
                    throw new Error(`selector.${type}.${key} 必须是选择器字符串。`)
                }
            }
        }
    }
    if (config.code) {
        throw new Error('Manifest V3 不支持通过 config.code 执行脚本，请使用选择器配置。')
    }
    return config
}

form.addEventListener('submit', async event => {
    event.preventDefault()
    if (generateButton.disabled) return

    rootInput.removeAttribute('aria-invalid')
    configInput.removeAttribute('aria-invalid')
    const root = rootInput.value.trim()
    if (!root) {
        rootInput.setAttribute('aria-invalid', 'true')
        rootInput.focus()
        showStatus('请填写根节点选择器。', true)
        return
    }

    let config
    try {
        config = readConfig()
    } catch (error) {
        configInput.setAttribute('aria-invalid', 'true')
        configInput.focus()
        showStatus(error.message, true)
        return
    }

    generateButton.disabled = true
    generateButton.textContent = '正在发送…'
    showStatus('正在向当前页面发送生成请求。')
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!tab || typeof tab.id !== 'number') {
            throw new Error('未找到当前标签页，请打开目标网页后重试。')
        }
        await chrome.tabs.sendMessage(tab.id, {
            command: 'createSkeleton',
            content: { root, config }
        })
        showStatus('请求已发送，请在目标页面查看效果及控制台输出。')
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        showStatus(`发送失败：${message}。请在普通网页中操作，加载扩展后刷新目标页面再重试。`, true)
    } finally {
        generateButton.disabled = false
        generateButton.textContent = '生成骨架屏'
    }
})
