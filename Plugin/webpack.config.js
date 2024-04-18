const HTMLPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
        main: "./src/sidebar/sidebar.tsx",
        background: "./src/background.js", // Added this line to include background.js
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
        /* Necessary to use HTMLPlugin to inject the bundle into the sidebar.html */
        new HTMLPlugin({
            title: "Sidebar",
            filename: "sidebar.html",
            template: "./public/sidebar.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: "public", 
                    to: "", 
                    globOptions: {
                        ignore: ["**/sidebar.html"], // This line excludes any file ending in .html in the public folder
                    },
                },
            ],
        }),
    ],
};
