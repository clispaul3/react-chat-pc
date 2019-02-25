const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlIndex = new HtmlWebpackPlugin({
    template:path.join(__dirname,'./src/index.html'),
    filename:path.join(__dirname,'./dist/index.html')
})
const targetUrl = {
  dev:'http://chattest.weinongtech.com',
  pro:'http://chat.weinongtech.com'
}
module.exports = {
    mode: 'development',
    entry:'./src/index.js',
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'render.js'
    },
    module:{
        rules:[
            {
                test:/\.js|jsx$/,
                use:'babel-loader',
                exclude:/node_modules/
            },
            {
                test:/\.css|.scss$/,
                use:['style-loader','css-loader','sass-loader']
            },{
                test:/\.woof|svg|eot|ttf|woff|png|jpg|gif$/,
                use:'url-loader'
            }
        ]
    },
    plugins:[
        htmlIndex
    ],
    resolve:{
        extensions:['.js','.jsx','.scss'],
        alias:{
            '@base':path.resolve('src/render/components/baseComponents'),
            '@module':path.resolve('src/render/components/moduleComponents'),
            '@':path.resolve('src/render'),
            '@static':path.resolve('static')
        }
    },
    devtool: 'inline-source-map',
    devServer:{
        contentBase:path.join(__dirname,'./dist/*'),
        historyApiFallback:true,
        inline:true,
        port:3000,
        proxy:{
            '/weinong':{
                target:targetUrl['bash-development'.indexOf('dev')>=0 ? 'dev' : 'pro'],
                secure:false,
                changeOrigin:true,
                pathRewrite:{
                '^/weinong':''
                }
            }
        }
    }
}
