/**
 * 2019/1/16 上午11:08
 */

let $ = require('jquery')

let renderText = require('./strategy/text')
let renderImg = require('./strategy/img')
let renderBlock = require('./strategy/block')
let renderBorder = require('./strategy/border')

let {SKELETON_TYPE, KEY} = require('./strategy/enum')

function autoSkeletonType($dom) {
    let domUitl = {
        // 判断是否为图片
        isImage($dom) {
            return (
                $dom &&
                $dom[0].tagName.toString().toLowerCase() === "img"
            );
        },
        // todo 判断是否为纯文本的容器
        isTextWrap($dom) {
            return !$dom.children().length && $dom.text()
        }
    };

    if (domUitl.isImage($dom)) {
        return SKELETON_TYPE.IMAGE
    }

    if (domUitl.isTextWrap($dom)) {
        return SKELETON_TYPE.TEXT
    }
}

function renderSkeleton($dom) {
    $dom.children().each(function () {
        let $this = $(this);
        let type = $this.attr(KEY)

        // todo 这里可以自动检测节点类型，并附上type
        if (!type) {
            type = autoSkeletonType($dom)
        }

        switch (type) {
            case SKELETON_TYPE.TEXT:
                renderText($this)
                break;
            case SKELETON_TYPE.IMAGE:
                renderImg($this)
                break
            case SKELETON_TYPE.BLOCK:
                renderBlock($this)
                break
            case SKELETON_TYPE.BORDER:
                renderBorder($this)
                break
            default:
                break;
        }
        // 递归
        renderSkeleton($this)
    });
}


module.exports = {
    renderSkeleton,
    SKELETON_TYPE,
    KEY
}
