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

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const useTypeScript = fs.existsSync(paths.appTsConfig);

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");

const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && "/";

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
                sourceMap: isEnvProduction && shouldUseSourceMap,
            },
        },
    ].filter(Boolean);
    if (preProcessor) {
        loaders.push(
            {
                loader: require.resolve("resolve-url-loader"),
                options: {
                    sourceMap: isEnvProduction && shouldUseSourceMap,
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
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",

    bail: isEnvProduction,
    devtool: isEnvProduction
        ? shouldUseSourceMap
            ? "source-map"
            : false
        : isEnvDevelopment && "cheap-module-source-map",

    entry: [
        isEnvDevelopment &&
            require.resolve("react-dev-utils/webpackHotDevClient"),

        paths.appIndexJs,
    ].filter(Boolean),
    output: {
        path: isEnvProduction ? paths.appBuild : undefined,

        pathinfo: isEnvDevelopment,

        filename: isEnvProduction
            ? "static/js/[name].[contenthash:8].js"
            : isEnvDevelopment && "static/js/bundle.js",

        futureEmitAssets: true,

        chunkFilename: isEnvProduction
            ? "static/js/[name].[contenthash:8].chunk.js"
            : isEnvDevelopment && "static/js/[name].chunk.js",

        publicPath: publicPath,

        devtoolModuleFilenameTemplate: isEnvProduction
            ? info =>
                  path
                      .relative(paths.appSrc, info.absoluteResourcePath)
                      .replace(/\\/g, "/")
            : isEnvDevelopment &&
              (info =>
                  path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),

        jsonpFunction: `webpackJsonp${appPackageJson.name}`,

        globalObject: "this",
    },
    optimization: {
        minimize: isEnvProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,

                        comparisons: false,

                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },

                    keep_classnames: isEnvProductionProfile,
                    keep_fnames: isEnvProductionProfile,
                    output: {
                        ecma: 5,
                        comments: false,

                        ascii_only: true,
                    },
                },

                parallel: !isWsl,

                cache: true,
                sourceMap: shouldUseSourceMap,
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    map: shouldUseSourceMap
                        ? {
                              inline: false,

                              annotation: true,
                          }
                        : false,
                },
            }),
        ],

        splitChunks: {
            chunks: "all",
            name: false,
        },

        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`,
        },
    },
    resolve: {
        modules: ["node_modules", paths.appNodeModules].concat(
            modules.additionalModulePaths || []
        ),

        extensions: paths.moduleFileExtensions
            .map(ext => `.${ext}`)
            .filter(ext => useTypeScript || !ext.includes("ts")),
        alias: {
            "react-native": "react-native-web",

            ...(isEnvProductionProfile && {
                "react-dom$": "react-dom/profiling",
                "scheduler/tracing": "scheduler/tracing-profiling",
            }),
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
                            sourceMap: isEnvProduction && shouldUseSourceMap,
                        }),

                        sideEffects: true,
                    },

                    {
                        test: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: isEnvProduction && shouldUseSourceMap,
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
                                sourceMap:
                                    isEnvProduction && shouldUseSourceMap,
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
                                sourceMap:
                                    isEnvProduction && shouldUseSourceMap,
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
                },
                isEnvProduction
                    ? {
                          minify: {
                              removeComments: true,
                              collapseWhitespace: true,
                              removeRedundantAttributes: true,
                              useShortDoctype: true,
                              removeEmptyAttributes: true,
                              removeStyleLinkTypeAttributes: true,
                              keepClosingSlash: true,
                              minifyJS: true,
                              minifyCSS: true,
                              minifyURLs: true,
                          },
                      }
                    : undefined
            )
        ),

        isEnvProduction &&
            shouldInlineRuntimeChunk &&
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

        new ModuleNotFoundPlugin(paths.appPath),

        new webpack.DefinePlugin(env.stringified),

        isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

        isEnvDevelopment && new CaseSensitivePathsPlugin(),

        isEnvDevelopment &&
            new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        isEnvProduction &&
            new MiniCssExtractPlugin({
                filename: "static/css/[name].[contenthash:8].css",
                chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            }),

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

        isEnvProduction &&
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

        isEnvProduction &&
            new ForkTsCheckerWebpackPlugin({
                typescript: resolve.sync("typescript", {
                    basedir: paths.appNodeModules,
                }),
                async: isEnvDevelopment,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                resolveModuleNameModule: process.versions.pnp
                    ? `${__dirname}/pnpTs.js`
                    : undefined,
                resolveTypeReferenceDirectiveModule: process.versions.pnp
                    ? `${__dirname}/pnpTs.js`
                    : undefined,
                tsconfig: paths.appTsConfig,
                reportFiles: [
                    "**",
                    "!**/__tests__/**",
                    "!**/?(*.)(spec|test).*",
                    "!**/src/setupProxy.*",
                    "!**/src/setupTests.*",
                ],
                silent: true,

                formatter: isEnvProduction ? typescriptFormatter : undefined,
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
