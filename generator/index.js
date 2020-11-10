module.exports = api => {
    console.log(api);
    api.injectImports(api.entryFile, `
    import MockUtil from 'vue-cli-plugin-mock/mock/local_util.js'
    window.mockUtil = new MockUtil();
    `);
}
