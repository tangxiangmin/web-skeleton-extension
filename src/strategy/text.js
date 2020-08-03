/**
 * 2019/1/16 上午11:04
 */

let {SKELETON_TYPE, KEY} = require('./enum')

function renderText($dom) {
    let fontSize = parseFloat($dom.css("font-size"));
    let lineHeight = $dom.css("line-height");

    // todo 处理浏览器默认行高、包含继承、自定义等属性
    if (lineHeight === "normal") {
        lineHeight = fontSize * 1.4;
    } else {
        lineHeight = parseFloat(lineHeight);
    }

    const textHeightRatio = fontSize / lineHeight;
    const firstColorPoint = (((1 - textHeightRatio) / 2) * 100).toFixed(2);
    const secondColorPoint = (((1 - textHeightRatio) / 2 + textHeightRatio) * 100).toFixed(2);

    const style = `--fp:${firstColorPoint}%;--sp:${secondColorPoint}%;--lh:${lineHeight}px;`;
    $dom.addClass('sk-text');
    $dom.attr("style", style);
}

module.exports = renderText
