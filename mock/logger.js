const chalk = require('chalk');
module.exports = {
    log: console.log.bind(console, chalk.blue('[MOCK] ')),
    debug: console.log.bind(console, chalk.green('[MOCK:DEBUG] ')),
    error: console.log.bind(console, chalk.red('[MOCK:ERROR] ')),
};
