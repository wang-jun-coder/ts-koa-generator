#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const path = require('path');

const FileHelper = require('../lib/FileHelper');
const Generator = require('../lib/Generator');
const CliHelper = require('../lib/CliHelper');

const run = async ()=> {

    /**
     *
     program
     .version(version, '-v  --version')
     .usage('[options] [dir]')
     .option('-e, --ejs', 'add ejs engine support', renamedOption('--ejs', '--view=ejs'))
     .option('    --pug', 'add pug engine support', renamedOption('--pug', '--view=pug'))
     .option('    --hbs', 'add handlebars engine support', renamedOption('--hbs', '--view=hbs'))
     .option('    --hjs', 'add hogan.js engine support', renamedOption('--hjs', '--view=hogan'))
     .option('    --njk', 'add nunjucks engine support', renamedOption('--njk', '--view=nunjucks'))
     .option('    --view <engine>', 'add view <engine> support (ejs|hbs|hogan|jade|pug|twig|vash|nunjucks) (defaults to nunjucks)')
     .option('-c, --css <engine>', 'add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)')
     .option('    --git', 'add .gitignore')
     .option('-f, --force', 'force on non-empty directory')
     .parse(process.argv)

     * */
    // 版本号
    const ver = await FileHelper.getVersion();
    program
        .version(ver, '-v,--version')
        .usage('[options] [dir]')
        .option('-p,--pug', 'add pug engine support')
        .option('   --view [engine]', 'add view engine support [ejs, pug]', 'pug')
        .option('   --css [engine]', 'add view engine support [css, less, sass]', 'css')
        .option('   --git', 'add .gitignore')
        .option('-f, --force', 'force on non-empty directory')
        .parse(process.argv);


    let viewEngine = program.view;
    if (program.pug) viewEngine = 'pug';
    let cssEngine = program.css;
    let addGitIgnore = program.git;
    let forceNonEmptyDir = program.force;
    let projectDir = path.resolve(program.args.pop() || '.');
    let appName = FileHelper.getAppNameWithPath(projectDir) || 'hello-world';

    const isEmpty = await FileHelper.dirIsEmpty(projectDir);
    const param = {viewEngine, cssEngine, addGitIgnore, forceNonEmptyDir, projectDir, appName};
    if (isEmpty || param.forceNonEmptyDir) {
        await Generator.generatorProject(param);
        return;
    }

    param.forceNonEmptyDir = await CliHelper.askToEmptyDir(param.projectDir);
    if (param.forceNonEmptyDir) {
        await fse.emptyDir(param.projectDir);
        await Generator.generatorProject(param);
    }

};
run().catch(error => console.log(error));
