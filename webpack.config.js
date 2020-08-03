let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const {name} = env || {}
    let entry = {
        content: path.resolve(__dirname, './src/content.js'),
        popup: path.resolve(__dirname, './src/popup.js')
    }
    const plugins = [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/popup.html'),
            filename: "popup.html",
            chunks: ['popup'],
        })
    ]

    if (name !== 'prod') {
        entry.index = path.resolve(__dirname, './src/index.js')
        plugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html'),
                filename: "index.html",
                chunks: ['index'],
            })
        )
    }
    return {
        mode: "development",
        entry,
        output: {
            path: path.resolve(__dirname, './src/dist'),
            filename: `[name].js`
        },
        module: {
            rules: [
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
        plugins,
        devServer: {
            contentBase: path.join(__dirname, "src"),
            compress: true,
            port: 9000
        }
    }
}
