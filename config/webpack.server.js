const webpackNodeExternals = require("webpack-node-externals");
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const resolve = require("resolve");

const path =require("path");

module.exports = {
    entry: path.join(__dirname, "../src/server.ts"),
    mode: process.env.NODE_ENV,
    node: {
        __filename: false,
        __dirname: false
    },
    target: "node",
    externals: [webpackNodeExternals()],
    devtool: "source-map",
    output: {
		filename: "[name]-bundle.js",
			chunkFilename: "[name].chunk.js",
			path: path.resolve(__dirname, "../dist"),
			publicPath: "/",
			libraryTarget: "commonjs2",
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false,
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
        extensions: [".ts", ".tsx", ".js", ".jsx", ".key",]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|key)$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
    plugins: process.env.NODE_ENV === "production" ? [
        new ForkTsCheckerWebpackPlugin({
            typescript: resolve.sync('typescript', {
              basedir: path.join(__dirname, "../node_modules/"),
            }),
            async: false,
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            resolveModuleNameModule: undefined,
            resolveTypeReferenceDirectiveModule: undefined,
            tsconfig: path.join(__dirname, "../tsconfig.json"),
            reportFiles: [
              '**',
              '!**/__tests__/**',
              '!**/?(*.)(spec|test).*',
              '!**/src/setupProxy.*',
              '!**/src/setupTests.*',
            ],
            silent: true,
            // The formatter is invoked directly in WebpackDevServerUtils during development
            formatter: typescriptFormatter,
          }),

            ] : []
}
