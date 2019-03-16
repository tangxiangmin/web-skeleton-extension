let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        content: path.resolve(__dirname, './src/content.js'),
        popup: path.resolve(__dirname, './src/popup.js'),
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
        // poll: 1000
    },
    externals: {
        Vue: 'window.Vue',
        // axios: "axios"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/popup.html'),
            filename: "popup.html",
            chunks: ['popup'],
        })
    ],
}
