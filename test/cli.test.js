/*
* 测试文件目录完整性
* */
const asset = require('assert');
const { exec, spawn } = require('child_process');
const path = require('path');

const fse = require('fs-extra');
const pty = require('pty.js');

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

/**
 * 检查生成项目的文件是否正常
 *
 * @param {String} projectPath 要检查的目录
 * @param {Object} options
 * @param {String} options.view 使用的模板引擎
 * @param {String} options.css 使用的样式引擎
 * @param {Boolean} options.git 是否添加 .gitignore 文件
 */
const checkFiles = async (projectPath, options) => {

    const { view, css, git } = options;

    let filePath = path.resolve(projectPath, `package.json`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `tsconfig.json`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    if (git) {
        let filePath = path.resolve(projectPath, `.gitignore`);
        asset(await fse.pathExists(filePath), `${filePath} not exists`);
    }

    filePath = path.resolve(projectPath, `src/bin/www.ts`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `src/public/images`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `src/public/javascripts`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `src/public/stylesheets/style.${css}`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `src/routes/index.ts`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `src/routes/users.ts`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    filePath = path.resolve(projectPath, `src/views/error.${view}`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);

    if (view === 'pug') {
        filePath = path.resolve(projectPath, `src/views/layout.${view}`);
        asset(await fse.pathExists(filePath), `${filePath} not exists`);
    }

    filePath = path.resolve(projectPath, `src/views/index.${view}`);
    asset(await fse.pathExists(filePath), `${filePath} not exists`);
};

describe('#ts-koa-generator.js', function () {

    describe('#ts-koa test', function () {
        before(async () => {
            await fse.mkdirp(tmpDir);
        });
        after(async () => {
            await fse.remove(tmpDir);
        });
        it('files equal', async () => {
            const projectName = 'test';
            await runScript('../bin/ts-koa-generator.js', [projectName], {cwd:tmpDir});
            const projectPath = path.resolve(tmpDir, projectName);
            await checkFiles(projectPath, {view:'pug', css:'css', git: false});

        });
    });

    describe('#ts-koa test -p', function () {
        before(async () => {
            await fse.mkdirp(tmpDir);
        });
        after(async () => {
            await fse.remove(tmpDir);
        });
        it('files equal', async () => {
            const projectName = 'test';
            await runScript('../bin/ts-koa-generator.js', [projectName, '-p'], {cwd:tmpDir});
            const projectPath = path.resolve(tmpDir, projectName);
            await checkFiles(projectPath, {view:'pug', css:'css', git: false});

        });
    });

    describe('#ts-koa test --css less', function () {
        before(async () => {
            await fse.mkdirp(tmpDir);
        });
        after(async () => {
            await fse.remove(tmpDir);
        });
        it('files equal', async () => {
            const projectName = 'test';
            await runScript('../bin/ts-koa-generator.js', [projectName, '--css', 'less'], {cwd:tmpDir});
            const projectPath = path.resolve(tmpDir, projectName);
            await checkFiles(projectPath, {view:'pug', css:'less', git: false});

        });
    });

    describe('#ts-koa test --view ejs', function () {
        before(async () => {
            await fse.mkdirp(tmpDir);
        });
        after(async () => {
            await fse.remove(tmpDir);
        });
        it('files equal', async () => {
            const projectName = 'test';
            await runScript('../bin/ts-koa-generator.js', [projectName, '--view', 'ejs'], {cwd:tmpDir});
            const projectPath = path.resolve(tmpDir, projectName);
            await checkFiles(projectPath, {view:'ejs', css:'css', git: false});

        });
    });

    describe('#ts-koa test --view ejs --css less', function () {
        before(async () => {
            await fse.mkdirp(tmpDir);
        });
        after(async () => {
            await fse.remove(tmpDir);
        });
        it('files equal', async () => {
            const projectName = 'test';
            await runScript('../bin/ts-koa-generator.js', [projectName, '--view', 'ejs', '--css', 'less'], {cwd:tmpDir});
            const projectPath = path.resolve(tmpDir, projectName);
            await checkFiles(projectPath, {view:'ejs', css:'less', git: false});

        });
    });


});
