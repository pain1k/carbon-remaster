const webpack = require('webpack')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const path = require("path");
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/',
    static:'static/'
}

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool:'eval-cheap-module-source-map',
    output:{
        filename: `${PATHS.assets}js/[name].js`,
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    devServer:{
        port:8081,
    },
    plugins:[
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
})

module.exports = new Promise((resolve,reject) => {
    resolve(devWebpackConfig)
})