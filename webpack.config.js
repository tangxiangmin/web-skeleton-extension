let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        index: path.resolve(__dirname, './src/index.js'),
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
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            }
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
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: "index.html",
            chunks: ['index'],
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "src"),
        compress: true,
        port: 9000
    }
}
