/**
 * 2019/3/16 下午3:33
 */

const KEY = {
    LOCAL_PLUGIN_CONFIG: 'LOCAL_PLUGIN_CONFIG',
}

let localModel = {
    set(key, data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data)
        }
        localStorage.setItem(key, data)
    },
    get(key) {
        let val = localStorage.getItem(key)
        try {
            return JSON.parse(val)
        } catch (e) {
            console.log(e)
            return {}
        }
    },
    remove(key) {
        localStorage.removeItem(key)
    }
}

module.exports = {
    KEY,
    //=====插件配置====//
    // 保存配置到本地
    setConfig(config) {
        localModel.set(KEY.LOCAL_PLUGIN_CONFIG, config)
    },
    // 获取本地配置
    getConfig() {
        return localModel.get(KEY.LOCAL_PLUGIN_CONFIG)
    },
}
