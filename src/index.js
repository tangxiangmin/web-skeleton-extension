import style from './style/index.css'


let $ = require('jquery')

let {
    renderSkeleton,
} = require("./skeleton")

// walk(body[0])
$(".btn").on("click", () => {
    let html = renderSkeleton(".page", {
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
    console.log(html)
})


