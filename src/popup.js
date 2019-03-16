/**
 * 2019/3/16 下午3:33
 */

let chromeMsg = require('./util/chromeMsg')
let chromeKit = require('./util/chromeKit')
let localModel = require('./util/localModel')


// let defaultParams = {"block":".test","image":".logo, .media_img","text":".wrap1, .nav_item,.media_tt, .media_ct, .text-red, .list .list_item","border":".media","code":"console.log(params)"}

let vm = new Vue({
    el: "#app",
    data() {
        return {
            params: {
                block: '',
                image: '',
                text: '',
                border: '',
                code: ''
            }
        }
    },
    created() {
        try {
            let defaultParams = localModel.getConfig()
            this.params = Object.assign(this.params, defaultParams)
        } catch (e) {
            console.log(e)
        }
    },

    methods: {
        createSkeleton() {
            let params = this.params
            localModel.setConfig(params)

            chromeKit.getCurrentTab().then(tab => {
                let {id} = tab

                chromeMsg.emit("createSkeleton", params, id)
            })
        },
    }
})
