'use strict';
// ANGULAR WEBPACK CONFIG!!!
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: __dirname + '/app/app.js',
    output: {
        path: __dirname + '/build/',
        publicPath: '/build/',
        filename: "[name].bundle.js"
    },

    watch: true,   

    watchOptions: {
        aggregateTimeout: 100   
    },

    devtool: "source-map",

    module: {
        loaders:[{
            test   : /\.js$/,
            exclude: /(node_modules|bower_components)/,             
            loaders : ['ng-annotate', 'babel?presets[]=es2015,presets[]=react,plugins[]=transform-runtime']
        },
        {
            test  : /\.css$/, 
            loader: 'style!css!autoprefixer!resolve-url'
        },
        {
            test  : /\.scss$/, 
            loader: ExtractTextPlugin.extract('style','css!autoprefixer!resolve-url!sass?sourceMap')
        },
        {
            test  : /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
            loader: 'url?name=images/[name].[ext]&limit=10000' 
        },
        {    
            test  : /\.html$/,
            loader : 'raw'
        }]
    },

    // Плагины
    plugins: [
        // Плагин для того чтобы собирать стили в файл, а не подключать через <style></style>
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('styles.css')
    ],   
}

