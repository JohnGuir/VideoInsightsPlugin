const HTMLPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
        sidebar: "./src/ui_components/sidebar.tsx",
        background: "./src/background.js", // Added this line to include background.js
        popup: "./src/ui_components/popup.tsx", // Added this line to include popup.tsx
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
        // fallback: {
        //     fs: false, // or require.resolve("fs-extra") if you prefer using a polyfill
        //     url: require.resolve("url/"),
        //     http: require.resolve("stream-http"),
        //     https: require.resolve("https-browserify"),
        //     stream: require.resolve("stream-browserify"),
        //     util: require.resolve("util/"),
        //     net: false, // No polyfill needed, set to false
        //     tls: false, // No polyfill needed, set to false
        // },
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
            chunks: ["sidebar"],
        }),
        /* Necessary to use HTMLPlugin to inject the bundle into the popup.html */
        new HTMLPlugin({
            title: "Popup",
            filename: "popup.html",
            template: "./public/popup.html",
            chunks: ["popup"],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: "public", 
                    to: "", 
                    globOptions: {
                        ignore: ["**/sidebar.html","**/popup.html"], 
                        // This line excludes any file ending in .html in the public folder
                    },
                },
            ],
        }),
    ],
};
