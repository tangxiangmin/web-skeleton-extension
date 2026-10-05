import './style/index.css'


import $ from 'jquery'

import {
    renderSkeleton,
} from './skeleton.js'

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


