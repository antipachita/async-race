const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.ts','.js'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
           filename: 'styles.css',
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //     {
        //         from: path.resolve(__dirname, './src/assets/images'),
        //         to: path.resolve(__dirname, 'dist/assets/images'),
        //     },
        //     ]
        // }),
    ],
};

module.exports = ({mode}) => {
    const isProductionMode = mode === 'prod';
    if (isProductionMode === true) {
        envConfig = require('./webpack.prod.config');
    } else {
        envConfig =require('./webpack.dev.config')
    };
    return merge(baseConfig, envConfig);
};
