const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

process.env.IS_SERVER = "true";

const vars = require("./env")("/", new RegExp(/^SERVER_/i));

module.exports = {
    target: "node",
    node: {
        __filename: false,
        __dirname: false,
    },
    externals: [nodeExternals()],
    entry: [
        "@babel/register",
        "core-js",
        "@babel/runtime-corejs3/regenerator",
        "./src/server/dev.ts",
    ],
    devtool: "source-map",
    mode: "development",
    output: {
        filename: "[name]-bundle.js",
        chunkFilename: "[name].chunk.js",
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/",
        libraryTarget: "commonjs2",
    },
    optimization: {
        splitChunks: {
            automaticNameDelimiter: "_",
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    minChunks: 2,
                },
            },
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".html"],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                include: /src/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|json|html)$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
    plugins: [new webpack.DefinePlugin(vars.stringified)],
};
