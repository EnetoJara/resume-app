const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const env = require("./env")("/", new RegExp(/^CLIENT_/i));

module.exports = {
    target: "web",
    entry: [
        "@babel/register",
        "react-hot-loader/patch",
        "core-js/stable",
        "@babel/runtime-corejs3/regenerator",
        "es6-promise/auto",
        path.join(__dirname, "../src/client/dev.tsx"),
    ],
    devtool: "source-map",
    mode: "development",
    output: {
        filename: "js/bundle.js",
        futureEmitAssets: true,
        path: path.resolve(__dirname, "../dist/build"),
        publicPath: "/",
        chunkFilename: "js/[name].chunk.js",
        jsonpFunction: `webpackJsonp-resume`,
    },
    optimization: {
        splitChunks: {
            automaticNameDelimiter: "_",
            cacheGroups: {
                commons: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2,
                },
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
        extensions: [
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".json",
            ".scss",
            ".css",
            ".html",
        ],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js|tsx|jsx|json)$/,
                exclude: /node_modules/,
                include: /src/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            presets: [
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],

                            plugins: [
                                "react-hot-loader/babel",
                                "@babel/syntax-dynamic-import",
                                [
                                    "@babel/plugin-transform-runtime",
                                    {
                                        corejs: { version: 3, proposals: true },
                                        useESModules: true,
                                    },
                                ],
                                "@babel/plugin-transform-async-to-generator",
                                "@babel/plugin-transform-regenerator",
                                "@babel/plugin-transform-block-scoping",
                                "@babel/plugin-transform-spread",
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-flexbugs-fixes"),
                                require("postcss-preset-env")({
                                    autoprefixer: {
                                        flexbox: "no-2009",
                                    },
                                    stage: 3,
                                }),
                            ],
                            sourceMap: true,
                        },
                    },
                    { loader: "sass-loader" },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
                loader: require.resolve("url-loader"),
                options: {
                    limit: 10000,
                    name: "media/[name].[ext]",
                },
            },
            {
                loader: require.resolve("file-loader"),

                exclude: [
                    /\.(js|mjs|jsx|ts|tsx)$/,
                    /\.html$/,
                    /\.json$/,
                    /\.LICENSE$/,
                    /\.scss$/,
                ],
                options: {
                    name: "media/[name].[hash:8].[ext]",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: path.join(__dirname, "../public/index.html"),
                }
            )
        ),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        new ModuleNotFoundPlugin("."),
        new webpack.DefinePlugin(env.stringified),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(
            path.join(__dirname, "../node_modules/")
        ),
        new ManifestPlugin({
            fileName: "asset-manifest.json",
            publicPath: "/",
            generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entrypoints.main.filter(
                    fileName => !fileName.endsWith(".map")
                );

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        isEnvProduction &&
            new WorkboxWebpackPlugin.GenerateSW({
                clientsClaim: true,
                exclude: [/\.map$/, /asset-manifest\.json$/],
                importWorkboxFrom: "cdn",
                navigateFallback: "/index.html",
                navigateFallbackBlacklist: [
                    // Exclude URLs starting with /_, as they're likely an API call
                    new RegExp("^/_"),
                    // Exclude any URLs whose last part seems to be a file extension
                    // as they're likely a resource and not a SPA route.
                    // URLs containing a "?" character won't be blacklisted as they're likely
                    // a route with query params (e.g. auth callbacks).
                    new RegExp("/[^/?]+\\.[^/]+$"),
                ],
            }),
    ].filter(Boolean),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        module: "empty",
        dgram: "empty",
        dns: "mock",
        fs: "empty",
        http2: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
};
