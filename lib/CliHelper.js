const inquirer = require('inquirer');
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
            message: `destination is not empty, continue ? [y/N]`,
            default: 'N',
            choices: ['y', 'N']
        }
    ]);
    return answers['clear'];
};


module.exports = CliHelper;
