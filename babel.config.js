module.exports = function (api) {
    api.cache(() => process.env.NODE_ENV);
    api.env();

    return {
        "presets": [
            "@babel/preset-react",
            "@babel/preset-typescript"
        ],
        "plugins": [
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-spread",
            "@babel/plugin-transform-function-name",
            "@babel/plugin-transform-arrow-functions"
        ]
    }
}
