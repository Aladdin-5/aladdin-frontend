const  path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const { plugin } = require('postcss');
const port=3000;
module.exports={
    devServer:{
        port:port,
        open:true,
        hot:true,
        compress:true,
        historyApiFallback:true,
        static:path.join(__dirname,'../dist'),
    },
 
    plugins:[
        new HtmlWebpackPlugin({
            title: 'guge',
            filename:'index.html',
            template:path.resolve(__dirname,'../src/indedx-dev.html')
        })
    ]
}