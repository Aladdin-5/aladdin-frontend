
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerplugin= require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { plugin } = require('postcss');
const  path = require('path');
module.exports={

    performance: {
        maxAssetSize: 250000,
        maxEntrypointSize: 250000,
        hints: 'warning',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerplugin({
                parallel: true
            }),
            new TerserPlugin({
                parallel: true
            }),
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: 'guge',
            filename:'index.html',
            template:path.resolve(__dirname,'../src/indedx-dev.html')
        })
    ]
}