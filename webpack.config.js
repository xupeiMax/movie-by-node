const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: __dirname + '/app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jade$/,
                use: 'jade-loader'
            },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: 'babel-loader',
                    // options:{
                    //     presets:[
                    //     'es2015','react'
                    //     ]
                    // }                
                },
                include: [path.resolve(__dirname,'app')],
                exclude: [path.resolve(__dirname,'/node_modules/')]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader',
                        options: {
                            module: true
                        }
                    }, {
                        loader: 'postcss-loader'
                    }
                ]            
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}