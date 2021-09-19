const path = require('path'); // importing path method
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'), //where to put bundled file
        filename: 'js/bundle.js', //bundled file name
    },
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', //output filename
            template: './src/index.html', //starting template
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/, //regex
                exclude: /node_module/, //exclude node modules
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
