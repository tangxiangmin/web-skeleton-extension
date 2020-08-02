/**
 * 2019/1/16 上午11:05
 */

function renderImg($img) {
    let width = $img.width()
    let height = $img.height()

    let emptyImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    $img.attr("src", emptyImage);

    $img.css({
        background: "#eee",
        width: width + "px",
        height: height + "px"
    })
}

module.exports = renderImg

