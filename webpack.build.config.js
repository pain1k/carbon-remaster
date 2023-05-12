const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const path = require("path");
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/',
    static:'static/'
}

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output:{
        filename: `${PATHS.assets}js/[name].js`,
        path: path.resolve(__dirname, './dist'),
        publicPath: './'
    },
    plugins:[]
})

module.exports = new Promise((resolve,reject) => {
    resolve(buildWebpackConfig)
})