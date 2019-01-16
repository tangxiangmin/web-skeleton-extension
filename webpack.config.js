
let path = require('path');

module.exports = {
    mode: "development",
    entry: {
        content: path.resolve(__dirname, './src/content.js'),
        background: path.resolve(__dirname, './src/background.js'),
    },
    output: {
        path: path.resolve(__dirname, './src/dist'),
        filename: `[name].js`
    },
    module: {
        rules: [
            // no need
            // {
            //     test: /\.js$/,
            //     loader: "babel-loader",
            // },
        ]
    },
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000
    },
    plugins: [],
}
