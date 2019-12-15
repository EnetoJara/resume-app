module.exports = function(api) {
    const { NODE_ENV, IS_SERVER = "true" } = process.env;

    api.cache(() => NODE_ENV && IS_SERVER == "true");
    api.env();

    console.log(IS_SERVER);
    console.log(NODE_ENV);

    if (NODE_ENV === "test") {
        return {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        target: {
                            node: "current",
                            esmodules: "false",
                        },
                        useBuiltIns: "entry",
                        corejs: 3,
                        modules: "commonjs",
                    },
                ],
                "@babel/preset-react",
                "@babel/preset-typescript",
            ],

            plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-syntax-dynamic-import",
            ],
        };
    }

    if (NODE_ENV === "development" && IS_SERVER == "true") {
        return {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            node: "current",
                            esmodules: false,
                        },
                        useBuiltIns: "entry",
                        modules: "commonjs",
                        corejs: 3,
                    },
                ],
                "@babel/preset-typescript",
            ],
            plugins: [
                "@babel/plugin-transform-modules-commonjs",
                "@babel/plugin-transform-async-to-generator",
                "@babel/plugin-transform-regenerator",
            ],
        };
    }

    if (NODE_ENV === "production" && IS_SERVER == "true") {
        return {
            presets: ["@babel/preset-typescript"],
            plugins: ["@babel/plugin-transform-modules-commonjs"],
        };
    }

    if (NODE_ENV === "development" && IS_SERVER == "false") {
        console.log("client dev");
        return {
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
            plugins: [
                [
                    "@babel/plugin-transform-runtime",
                    {
                        corejs: { version: 3, proposals: true },
                        useESModules: true,
                    },
                ],
                "react-hot-loader/babel",
                "@babel/plugin-syntax-dynamic-import",
            ],
        };
    }

    if (NODE_ENV === "production" && IS_SERVER == "false") {
        return {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            node: "current",
                            browsers: [
                                ">1%",
                                "last 4 versions",
                                "ie >= 11",
                                "edge >= 16",
                                "firefox >= 43",
                                "Firefox ESR",
                                "chrome >= 47",
                                "ChromeAndroid >= 69.0",
                                "safari >= 11",
                            ],
                            esmodules: true,
                        },
                        useBuiltIns: "entry",
                        corejs: 3,
                    },
                ],
                "@babel/preset-react",
                "@babel/preset-typescript",
            ],
            plugins: [
                ["@babel/plugin-transform-react-inline-elements"],
                ["@babel/plugin-transform-react-constant-elements"],
                ["transform-inline-environment-variables"],
                ["minify-mangle-names"],
                "babel-plugin-transform-react-remove-prop-types",
                [
                    "@babel/plugin-transform-runtime",
                    {
                        corejs: { version: 3, proposals: true },
                        useESModules: true,
                    },
                ],
                "@babel/plugin-transform-async-to-generator",
                "@babel/plugin-transform-block-scoped-functions",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-classes",
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-proposal-export-namespace-from",
                "@babel/plugin-proposal-function-bind",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-throw-expressions",
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-destructuring",
                "@babel/plugin-transform-exponentiation-operator",
                "@babel/plugin-transform-function-name",
                "@babel/plugin-transform-instanceof",
                "@babel/plugin-transform-new-target",
                "@babel/plugin-transform-object-super",
                "@babel/plugin-transform-parameters",
                "@babel/plugin-transform-property-mutators",
                "@babel/plugin-transform-regenerator",
                "@babel/plugin-transform-reserved-words",
                "@babel/plugin-transform-shorthand-properties",
                "@babel/plugin-transform-spread",
                "@babel/plugin-transform-template-literals",
                "babel-plugin-transform-minify-booleans",
                "babel-plugin-transform-property-literals",
            ],
        };
    }
};
