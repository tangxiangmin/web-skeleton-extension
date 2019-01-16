/**
 * 2019/1/16 上午11:04
 */

let {SKELETON_TYPE, KEY} = require('./enum')

function renderText($dom) {
    // todo 如果父元素已处理，此处是渲染深色背景还是不展示呢
    let color = "#eee";
    if ($dom.parents(`[${KEY}=${SKELETON_TYPE.TEXT}]`).length) {
        // todo deep color
        color = "#ccc"
        // return false
    }

    let fontSize = parseFloat($dom.css("font-size"));
    let lineHeight = $dom.css("line-height");

    // todo 处理浏览器默认行高、包含继承、自定义等属性
    if (lineHeight === "normal") {
        lineHeight = fontSize * 1.5;

    } else {
        lineHeight = parseInt(lineHeight);
    }

    let decimal = 2;
    const textHeightRatio =
        parseFloat(fontSize, 10) / parseFloat(lineHeight, 10);
    const firstColorPoint = (((1 - textHeightRatio) / 2) * 100).toFixed(
        decimal
    );
    const secondColorPoint = (
        ((1 - textHeightRatio) / 2 + textHeightRatio) *
        100
    ).toFixed(decimal);


    const rule = `
                background-image: linear-gradient(transparent ${firstColorPoint}%, ${color} 0,${color} ${secondColorPoint}%, transparent 0);
                background-size: 100% ${lineHeight}px;
                background-origin: content-box;
                background-clip: content-box;
                background-color: transparent;
                background-repeat: repeat-y;
                color: ${color};
            `;
    $dom.attr("style", rule);
}

module.exports = renderText
