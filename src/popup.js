// import {localConfigModel} from "./util/localModel";

let chromeMsg = require('./util/chromeMsg')
let chromeKit = require('./util/chromeKit')

let vm = new Vue({
    el: "#app",
    data() {
        let defaultConfig = /*localConfigModel.get() || */{
            ignore: '',
            selector: {
                block: {
                    include: ''
                },
                list: {
                    exclude: ''
                },
                button: {}
            }
        }
        return {
            params: {
                root: 'body',
                config: JSON.stringify(defaultConfig)
            }
        }
    },
    methods: {
        createSkeleton() {
            let params = this.params


            chromeKit.getCurrentTab().then(tab => {
                let {id} = tab


                let data = {...params}
                try {
                    data.config = JSON.parse(data.config || '') || {}
                } catch (e) {
                    alert('请传入正确的JSON配置项:' + e)
                    return
                }
                // localConfigModel.set(data)
                chromeMsg.emit("createSkeleton", params, id)
            })
        },
    }
})
