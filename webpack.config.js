const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: "./src/index.ts",

    // Output filename
    output: {
        path: __dirname + '/dist',
        filename: 'chess-twitch-bot.js',
    },

    // Enable sourcemaps for debugging webpack's output
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {test: /\.tsx?$/, use: 'ts-loader'}
        ]
    },

    // Ignore built-in modules like path, fs, etc
    target: 'node',

    // Ignore all modules in the node_modules folder
    externals: [nodeExternals()],


};