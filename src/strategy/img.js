/**
 * 2019/1/16 上午11:05
 */

function renderImg($img) {
    let width = $img.width()
    let height = $img.height()

    $img.attr(
        "src",
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    );

    $img.css({
        background: "#eee",
        width: width + "px",
        height: height+"px"
    })
}

module.exports = renderImg

