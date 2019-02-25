
const path = require('path')
module.exports = {
    mode: 'production',
    entry:'./src/main/test.js',
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'main.js'
    },
    module:{
        rules:[
            {
                test:/\.js|jsx$/,
                use:'babel-loader',
                exclude:/node_modules/
            },{
                test:/\.woof|svg|eot|ttf|woff|png|jpg|gif$/,
                use:'url-loader'
            }
        ]
    },
    resolve:{
        extensions:['.js'],
    },
    devtool: 'inline-source-map',
}

