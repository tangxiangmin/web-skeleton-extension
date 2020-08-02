module.exports = function renderList($dom) {
    $dom.addClass("sk-list")

    let $children = $dom.children()
    let $child = $children.first()
    let len = $children.length

    // 列表元素子节点统一，保证页面骨架整齐
    for (let i = 1; i < len; ++i) {
        $children.eq(i).remove()
    }
    for (let i = 1; i < len; i++) {
        let tmp = $child.clone(true)
        $dom.append(tmp)
    }
}
