export default function ($node) {
    const width = $node.width()
    const height = $node.height()
    const classname = 'sk-button'
    $node.addClass(classname)
    $node.width(width).height(height)
}
