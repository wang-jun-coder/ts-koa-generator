const inquirer = require('inquirer');
const chalk = require('chalk');
const CliHelper = {};

/**
 * 询问用户是否清空某目录
 *
 * @param {String} dir 文件路径
 * @return {Promise<boolean>}
 */
CliHelper.askToEmptyDir = async (dir) => {
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'clear',
            message: `destination is not empty, continue ?`,
            default: 'N',
            choices: ['y', 'N']
        }
    ]);
    return answers['clear'];
};

CliHelper.logCreate = msg => {
    console.log(chalk.blue('create: ') + msg);
};

CliHelper.logTip = msg => {
    console.log(msg);
};

module.exports = CliHelper;
