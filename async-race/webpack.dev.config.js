const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        hot: true,
        port: 8080,
    },
};
