module.exports = function (api) {

    const { NODE_ENV, IS_SERVER="true" } = process.env;

    api.cache(() => NODE_ENV && IS_SERVER == "true");
    api.env();

    console.log(IS_SERVER)
    console.log(NODE_ENV)

    if (NODE_ENV === "test") {

        return {
            "presets": [
                ["@babel/preset-env", {
                    "target": {
                        "node": "current",
                        "esmodules": "false"
                    },
                    "useBuiltIns": "entry",
                    "corejs": 3,
                    "modules": "commonjs"
                }],
                "@babel/preset-react",
                "@babel/preset-typescript"
            ],

            "plugins": [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-syntax-dynamic-import"
            ]
        }
    }

    if (NODE_ENV === "development" && IS_SERVER == "true") {
        return {
            presets: [
                "@babel/preset-typescript"
            ],
            plugins: [
                "@babel/plugin-transform-modules-commonjs"
            ]
        }
    }


    if (NODE_ENV === "production" && IS_SERVER == "true") {
        return {
            presets: [
                "@babel/preset-env",
                "@babel/preset-typescript"
            ],
            plugins: [
                "@babel/plugin-transform-modules-commonjs",
                ["@babel/plugin-transform-runtime", { corejs: { version: 3, proposals: true }, useESModules: false }]
            ]
        }
    }

    if (NODE_ENV === "development" && IS_SERVER == "false") {
        return {
            presets: [
                "@babel/preset-react",
                "@babel/preset-typescript"
            ],
            plugins: [
                ["@babel/plugin-transform-runtime", { corejs: { version: 3, proposals: true }, useESModules: true }]
            ]
        }
    }


    if (NODE_ENV === "production" && IS_SERVER == "false") {
        return {
            presets: [
                ["@babel/preset-env", {
                    "targets": {
                        "node": "current",
                        "browsers": [
                            ">1%",
                        "last 4 versions",
                        "ie >= 11",
                        "edge >= 16",
                        "firefox >= 43",
                        "Firefox ESR",
                        "chrome >= 47",
                        "ChromeAndroid >= 69.0",
                        "safari >= 11"
                        ],
                        "esmodules": true
                    },
                    "useBuiltIns": "entry",
                    "corejs": 3
                }],
                "@babel/preset-react",
                "@babel/preset-typescript"
            ]
        }
    }
}
