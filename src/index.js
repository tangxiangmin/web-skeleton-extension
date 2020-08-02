import style from './style/index.css'


let $ = require('jquery')

let {
    renderSkeleton,
} = require("./skeleton")

let body = $("body")
// walk(body[0])
$(".btn").on("click", () => {
    renderSkeleton(body, {
        ignore: '',
        selector: {
            block: {
                // include: ['.media'].join(',')
            },
            list: {
                exclude: ['.nav-list'].join(',')
            }
        }
    })
})


