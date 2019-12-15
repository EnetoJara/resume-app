"use strict";

const fs = require("fs");
const isWsl = require("is-wsl");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const paths = require("./paths");
const modules = require("./modules");
const getClientEnvironment = require("./env");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

const postcssNormalize = require("postcss-normalize");

const appPackageJson = require(paths.appPackageJson);

const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

const publicPath = isEnvProduction ? paths.servedPath : "/";

const shouldUseRelativeAssetPaths = publicPath === "./";

const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && "";

const env = getClientEnvironment(publicUrl, new RegExp(/^CLIENT_/i));

const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        isEnvDevelopment && require.resolve("style-loader"),
        isEnvProduction && {
            loader: MiniCssExtractPlugin.loader,
            options: shouldUseRelativeAssetPaths
                ? { publicPath: "../../" }
                : {},
        },
        {
            loader: require.resolve("css-loader"),
            options: cssOptions,
        },
        {
            loader: require.resolve("postcss-loader"),
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

                    postcssNormalize(),
                ],
                sourceMap: true,
            },
        },
    ].filter(Boolean);
    if (preProcessor) {
        loaders.push(
            {
                loader: require.resolve("resolve-url-loader"),
                options: {
                    sourceMap: true,
                },
            },
            {
                loader: require.resolve(preProcessor),
                options: {
                    sourceMap: true,
                },
            }
        );
    }
    return loaders;
};

module.exports = {
    mode: "development",

    bail: false,
    devtool: "source-map",
    entry: [
        "@babel/register",
        "core-js",
        "react-hot-loader/path",
        "@babel/generator",
        "es6-promise/auto",
        paths.appIndexJs,
    ].filter(Boolean),
    output: {
        path: undefined,
        pathinfo: true,
        filename: "static/js/bundle.js",
        futureEmitAssets: true,
        chunkFilename: "static/js/[name].chunk.js",
        publicPath: publicPath,
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),

        jsonpFunction: `webpackJsonp${appPackageJson.name}`,

        globalObject: "this",
    },
    optimization: {
        splitChunks: {
            automaticNameDelimiter: "_",
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    // cacheGroupKey here is `commons` as the key of the cacheGroup
                    name(module, chunks, cacheGroupKey) {
                        const moduleFileName = module
                            .identifier()
                            .split("/")
                            .reduceRight(item => item);
                        const allChunksNames = chunks
                            .map(item => item.name)
                            .join("~");
                        return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                    },
                },
                chunks: "all",
            },
        },
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`,
        },
    },
    optimization: {
        minimize: false,

        splitChunks: {
            chunks: "all",
            name: false,
        },
    },
    resolve: {
        modules: ["node_modules", paths.appNodeModules].concat(
            modules.additionalModulePaths || []
        ),

        extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
        alias: {
            "react-native": "react-native-web",

            ...(modules.webpackAliases || {}),
        },
        plugins: [
            PnpWebpackPlugin,

            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
        ],
    },
    devServer: {
        port: 3001,
        disableHostCheck: true,
        compress: true,
        clientLogLevel: "info",
        contentBase: paths.appPublic,
        watchContentBase: true,
        hot: true,
        transportMode: "ws",
        injectClient: false,
        publicPath: "/",
        quiet: false,
        watchOptions: {
            ignored: paths.appSrc,
        },
        https: false,
        host: "localhost",
        overlay: false,
        historyApiFallback: {
            disableDotRule: true,
        },
    },

    resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    module: {
        strictExportPresence: true,
        rules: [
            { parser: { requireEnsure: false } },

            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                enforce: "pre",
                use: [
                    {
                        options: {
                            cache: true,
                            formatter: require.resolve(
                                "react-dev-utils/eslintFormatter"
                            ),
                            eslintPath: require.resolve("eslint"),
                            resolvePluginsRelativeTo: __dirname,
                        },
                        loader: require.resolve("eslint-loader"),
                    },
                ],
                include: paths.appSrc,
            },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve("url-loader"),
                        options: {
                            limit: imageInlineSizeLimit,
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    },

                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve("babel-loader"),
                        options: {
                            customize: require.resolve(
                                "babel-preset-react-app/webpack-overrides"
                            ),

                            plugins: [
                                [
                                    require.resolve(
                                        "babel-plugin-named-asset-import"
                                    ),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent:
                                                    "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                                            },
                                        },
                                    },
                                ],
                            ],

                            cacheDirectory: true,

                            cacheCompression: false,
                            compact: isEnvProduction,
                        },
                    },

                    {
                        test: /\.(js|mjs)$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime/,
                        loader: require.resolve("babel-loader"),
                        options: {
                            babelrc: false,
                            configFile: false,
                            compact: false,
                            presets: [
                                [
                                    require.resolve(
                                        "babel-preset-react-app/dependencies"
                                    ),
                                    { helpers: true },
                                ],
                            ],
                            cacheDirectory: true,

                            cacheCompression: false,

                            sourceMaps: false,
                        },
                    },

                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: true,
                        }),

                        sideEffects: true,
                    },

                    {
                        test: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: true,
                            modules: true,
                            getLocalIdent: getCSSModuleLocalIdent,
                        }),
                    },

                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: true,
                            },
                            "sass-loader"
                        ),

                        sideEffects: true,
                    },

                    {
                        test: sassModuleRegex,
                        use: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: true,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                            "sass-loader"
                        ),
                    },

                    {
                        loader: require.resolve("file-loader"),

                        exclude: [
                            /\.(js|mjs|jsx|ts|tsx)$/,
                            /\.html$/,
                            /\.json$/,
                        ],
                        options: {
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: paths.appHtml,
                }
            )
        ),

        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

        new ModuleNotFoundPlugin(paths.appPath),

        new webpack.DefinePlugin(env.stringified),

        new webpack.HotModuleReplacementPlugin(),

        new CaseSensitivePathsPlugin(),

        new WatchMissingNodeModulesPlugin(paths.appNodeModules),

        new ManifestPlugin({
            fileName: "asset-manifest.json",
            publicPath: publicPath,
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

        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            exclude: [/\.map$/, /asset-manifest\.json$/],
            importWorkboxFrom: "cdn",
            navigateFallback: publicUrl + "/index.html",
            navigateFallbackBlacklist: [
                new RegExp("^/_"),

                new RegExp("/[^/?]+\\.[^/]+$"),
            ],
        }),
    ].filter(Boolean),

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

    performance: false,
};
