module.exports = function (config) {
    config.set({
        mochaOptions: { files: ['mocha/**/*.test.ts'], opts: './mocha/mocha.opts', ui: 'bdd', require: ['ts-node/register', 'source-map-support/register'], asyncOnly: false, },
        mutator: "typescript",
        packageManager: "npm",
        reporters: ["html", "clear-text", "progress", "dashboard"],
        testRunner: "mocha",
        transpilers: ["babel"],
        testFramework: "mocha",
        coverageAnalysis: "off",
        tsconfigFile: "tsconfig.json",
        mutate: [
            "!src/api.ts",
            "!src/index.ts",
            "src/**/*.ts"],
        babel: {
            optionsFile: ".babelrc",
        },
    });
};
