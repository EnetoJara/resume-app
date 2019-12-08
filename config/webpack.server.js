const webpackNodeExternals = require("webpack-node-externals");
const path =require("path");

module.exports = {
    entry: path.join(__dirname, "../src/server.ts"),
    mode: "development",
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
}
