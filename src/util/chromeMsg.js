let eventList = []
if (chrome.runtime) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        let {command, content} = message
        if (Array.isArray(eventList[command])) {
            eventList[command].forEach(handler => {
                handler(content, sender, sendResponse)
            })
        }
    });

}

export default {
    on(eventName, cb, mult = false) {
        if (!eventList[eventName]) {
            eventList[eventName] = []
        }

        // 默认只监听同一个事件名只监听一次
        if (typeof cb === 'function') {
            if (eventList[eventName].length) {
                console.log(`${eventName} 事件在其他地方已经监听，默认会覆盖其他地方的事件处理函数，如需要请传入第三个参数mult为true`)
            }

            if (mult) {
                eventList[eventName].push(cb)
            } else {
                eventList[eventName] = [cb]
            }
        }
    },
    emit(command, content, tabId) {
        if (tabId) {
            // 向指定标签页发送消息
            chrome.tabs.sendMessage(tabId, {command, content});
        } else {
            // 向background发送消息
            chrome.runtime.sendMessage({command, content});
        }
    },
    showAllListener() {
        console.log(eventList)
    }
}
