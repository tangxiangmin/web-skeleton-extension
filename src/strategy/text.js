/**
 * 2019/1/16 上午11:04
 */


function renderText($dom) {
    // 内联文字需要承载骨架宽高；块级元素保留原布局及外边距折叠行为。
    if ($dom.css('display') === 'inline') {
        $dom.css('display', 'inline-block');
    }
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

    $dom.addClass('sk-text');
    $dom.css({
        '--fp': `${firstColorPoint}%`,
        '--sp': `${secondColorPoint}%`,
        '--lh': `${lineHeight}px`
    });
}

export default renderText
