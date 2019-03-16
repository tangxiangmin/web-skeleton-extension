/**
 * 2019/1/16 上午11:35
 */


function renderBlock($dom) {
    let color = "#eee"
    $dom.css({
        "background": color,
        "border-color": color
    })
    // $dom.find("*").css({
    //     opacity: 0
    // })
}

module.exports = renderBlock
