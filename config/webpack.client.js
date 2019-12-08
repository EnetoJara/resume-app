
const fs = require('fs');
const isWsl = require('is-wsl');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

const  isEnvProduction = process.env.NODE_ENV === "production";
console.log(isEnvProduction);
module.exports = {
    target: "web",
    entry: path.join(__dirname, "../src/app.tsx"),
    devtool: "source-map",
    mode: "development",
    output: {
        filename: isEnvProduction
          ? 'js/[name].[contenthash:8].js'
          : 'js/bundle.js',
        futureEmitAssets: true,
        path: path.resolve(__dirname, "../dist/build"),
        publicPath: "/",
        chunkFilename: isEnvProduction
          ? 'js/[name].[contenthash:8].chunk.js'
          : 'js/[name].chunk.js',
        jsonpFunction: `webpackJsonp-resume`,
        globalObject: 'this',
        pathinfo: true,

      },
      optimization: isEnvProduction ? {
        minimize: true,
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
              keep_classnames: false,
              keep_fnames: false,
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
            sourceMap: false,
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map: false,
            },
          }),
        ],
        splitChunks: {
          chunks: 'all',
          name: false,
        },
        runtimeChunk: {
          name: entrypoint => `runtime-${entrypoint.name}`,
        },
      }
      : {
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
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".scss", ".css", ".html"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js|tsx|jsx|json)$/,
                exclude: /node_modules/,
                include: /src/,
                use: [{loader: "babel-loader"}]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "postcss-loader", options: {
                        ident: "postcss",
                        plugins: () => [
                            require("postcss-flexbugs-fixes"),
                            require("postcss-preset-env")({autoprefixer: {
                                flexbox: "no-2009",
                            }, stage: 3}),
                        ],
                        sourceMap: true
                    }},
                    {loader: "sass-loader"}
                ]
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
                    /\.scss$/
                ],
                options: {
                    name: "media/[name].[hash:8].[ext]",
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: true,
              template: path.join(__dirname, "../public/index.html"),
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
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, process.env),
        new ModuleNotFoundPlugin("."),
        new webpack.DefinePlugin(process.env),
        !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
        !isEnvProduction && new CaseSensitivePathsPlugin(),
        !isEnvProduction &&
          new WatchMissingNodeModulesPlugin(path.join(__dirname, "../node_modules/")),
        isEnvProduction &&
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
          }),
        new ManifestPlugin({
          fileName: 'asset-manifest.json',
          publicPath: "/",
          generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce((manifest, file) => {
              manifest[file.name] = file.path;
              return manifest;
            }, seed);
            const entrypointFiles = entrypoints.main.filter(
              fileName => !fileName.endsWith('.map')
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
            importWorkboxFrom: 'cdn',
            navigateFallback: '/index.html',
            navigateFallbackBlacklist: [
              // Exclude URLs starting with /_, as they're likely an API call
              new RegExp('^/_'),
              // Exclude any URLs whose last part seems to be a file extension
              // as they're likely a resource and not a SPA route.
              // URLs containing a "?" character won't be blacklisted as they're likely
              // a route with query params (e.g. auth callbacks).
              new RegExp('/[^/?]+\\.[^/]+$'),
            ],
          }),
        // TypeScript type checking
      ].filter(Boolean),
      // Some libraries import Node modules but don't use them in the browser.
      // Tell Webpack to provide empty mocks for them so importing them works.
      node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },
      // Turn off performance processing because we utilize
      // our own hints via the FileSizeReporter
      performance: false,
    };
