/*
* 测试新建文件可运行性
* */


const asset = require('assert');
const { exec, spawn } = require('child_process');
const path = require('path');

const fse = require('fs-extra');
const pty = require('pty.js');
const supertest = require('supertest');


const binPath = path.resolve(__dirname, '../bin/ts-koa-generator.js');
const tmpDir = path.resolve(__dirname, '../temp');
const tmpProject = `project`;

const log = (...args) => {console.log(...args, '\n')};

/**
 * 执行脚本命令
 *
 * @param {String} command 要执行的命令
 * @param {Array} args, 字符串参数列表
 * @param {Object} options 额外参数
 * @param {String} options.cwd 命令执行的目录
 * @param {Object} options.env 环境变量对
 * @return {Promise<{
 *     stdout: String,
 *     stderr: String
 * }>}
 */
const runScript = async (command, args, options) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {...options});
        let stdout = ``;
        let stderr = ``;
        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');

        child.stdout.on('data', data => stdout += data);
        child.stderr.on('data', data => stderr += data);

        child.on('close', code => resolve({stdout, stderr}));
        child.on('error', error => reject(error));
    });
};


describe('#test project run', function () {

    describe('#run default', function () {
        this.timeout(30000);

        before(async () => {
            await fse.mkdirp(tmpDir);
        });
        after(async () => {
            await fse.remove(tmpDir);
        });


        it('should run', async () => {

            const projectName = 'test';
            await runScript('../bin/ts-koa-generator.js', [projectName], {cwd:tmpDir});
            const projectPath = path.resolve(tmpDir, projectName);
            await runScript('npm', ['--registry=https://registry.npm.taobao.org', 'install'], {cwd: projectPath});
            await runScript('npm', ['run', 'build'], {cwd:projectPath});
            const appPath = path.resolve(projectPath, 'dist/app.js');
            const app = require(appPath);
            let res = await supertest(app.default.callback()).get('/');
            asset(res.text.includes('Welcome to Koa!'), 'server response not expect');
            res = await supertest(app.default.callback()).get('/json');
            let json = JSON.parse(res.text);
            asset(json,'/json shuld respons a json object');
            res = await supertest(app.default.callback()).get('/string');
            asset(res.text === 'welcome to Koa!', `/string should response "welcome to Koa!" but response${res.text}`);

        });
    })

});
