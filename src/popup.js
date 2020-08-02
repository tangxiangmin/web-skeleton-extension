/**
 * 2019/3/16 下午3:33
 */

import {localConfigModel} from "./util/localModel";

let chromeMsg = require('./util/chromeMsg')
let chromeKit = require('./util/chromeKit')

let defaultParams = {
    "block": ".test",
    "image": ".logo, .media_img",
    "text": ".wrap1, .nav_item,.media_tt, .media_ct, .text-red, .list .list_item",
    "border": ".media",
    "code": "console.log(params)"
}

defaultParams = {
    // image: '.container.course',
    text: '.course .course_tt, .date-group p'
}

let vm = new Vue({
    el: "#app",
    data() {
        return {
            params: {
                block: '',
                image: '',
                text: '',
                border: '',
                code: '',
                ...defaultParams
            }
        }
    },
    created() {
        try {
            // let defaultParams = localConfigModel.get()
            // this.params = Object.assign(this.params, defaultParams)
        } catch (e) {
            console.log(e)
        }
    },

    methods: {
        createSkeleton() {
            let params = this.params
            localConfigModel.set(params)

            chromeKit.getCurrentTab().then(tab => {
                let {id} = tab

                chromeMsg.emit("createSkeleton", params, id)
            })
        },
    }
})
