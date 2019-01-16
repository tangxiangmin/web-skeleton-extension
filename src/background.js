/**
 * 2019/1/16 上午9:53
 */
let chromeMsg = require('./util/chromeMsg')
let chromeKit = require('./util/chromeKit')

let app = {
    init(){
        this.browserAction()
    },
    browserAction() {
        chrome.browserAction.onClicked.addListener(function () {
            // chromeKit.showTip("正在生成骨架屏...")
            chromeKit.getCurrentTab().then(tab=>{
                let {id} = tab
                chromeMsg.emit("createSkeleton", "", id)
            })
        })
    }
}
app.init()
