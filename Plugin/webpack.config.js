const HTMLPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
        main: "./src/index.tsx",
        background: "./public/background.js", // Added this line to include background.js
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js)$/, // Including .js in the test regex
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js", // Using [name] to output multiple bundles
    },
    plugins: [
        /* Necessary to use HTMLPlugin to inject the bundle into the index.html */
        new HTMLPlugin({
            template: "./public/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: "public", 
                    to: "", 
                    globOptions: {
                        ignore: ["**/index.html"], // This line excludes index.html
                    },
                },
            ],
        }),
    ],
};
