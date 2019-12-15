"use strict";
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");
const resolve = require("resolve");
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
        "es6-promise/auto",
        path.join(__dirname, "../src/server/dev.ts"),
    ],
    devtool: "source-map",
    mode: process.env.NODE_ENV,
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
                common: {
                    name: "common",
                    minChunks: 2,
                    chunks: "async",
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                vendor: {
                    // name of the chunk
                    name: "vendor",
                    // async + async chunks
                    chunks: "all",
                    // import file path containing node_modules
                    test: /node_modules/,
                    // priority
                    priority: 20,
                },
            },
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin(vars.stringified),
        new ForkTsCheckerWebpackPlugin({
            typescript: resolve.sync("typescript", {
                basedir: path.join(__dirname, "../node_modules/"),
            }),
            async: true,
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            resolveModuleNameModule: undefined,
            resolveTypeReferenceDirectiveModule: undefined,
            tsconfig: path.join(__dirname, "../tsconfig.server.json"),
            reportFiles: [
                "**/src/server/**",
                "!**/__tests__/**",
                "!**/?(*.)(spec|test).*",
                "!**/src/setupProxy.*",
                "!**/src/setupTests.*",
            ],
            silent: false,

            formatter: typescriptFormatter,
        }),
    ],
};
