const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = false
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/',
    static:'static/'
}
const PAGES_DIR = PATHS.src
const PAGES = fs
    .readdirSync(PAGES_DIR)
    .filter(fileName => fileName.endsWith('.html'))

module.exports = {
    externals:{
        paths: PATHS
    },
    entry:{
        app:'./src/index.js'
    },
    module:{
        rules:[{
            test:/\.js$/,
            loader: 'babel-loader',
            exclude:'/node_modules'
        },
            {
                // Fonts
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                type:'asset/resource',
                generator:{
                    filename: './assets/fonts/[name].[ext]'
                }
            },
            {
                test:/\.(png|jpg|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: './static/img/[name].[ext]'
                    }
            },
            {
            test:/\.scss$/,
            use:[ isDev ? "style-loader" :
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options:{
                        sourceMap:true
                    }
                },{
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        postcssOptions:{
                            config: './postcss.config.js'
                        },
                    }
                },{
                    loader:'sass-loader',
                    options:{
                        sourceMap: true
                    }
                },
            ]
        },
            {
                test:/\.css$/,
                use:[isDev? "style-loader" :
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options:{
                            sourceMap:true
                        }
                    },{
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            postcssOptions:{
                                config: './postcss.config.js'
                            },
                        }
                    }
                ]
            }],

    },
    plugins: [
        new MiniCssExtractPlugin({
            filename:`[name].css`
        }),
        new HtmlWebpackPlugin({
            hash:false,
            template:`${PATHS.src}/index.html`,
            filename:'./index.html'
        }),
        new CopyWebpackPlugin(
            { patterns:[
            {
                from :`${PATHS.src}/${PATHS.assets}img/`,
                to : `${PATHS.assets}img/`
            },
            {
                from :`${PATHS.src}/static/`,
                to : `${PATHS.static}`
            }
        ]
            }),
        ...PAGES.map(
            page =>
                new HtmlWebpackPlugin({
                    template: `${PAGES_DIR}/${page}`,
                    filename: `./${page}`
                })
        )
    ],
    resolve:{

    }
}