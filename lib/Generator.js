const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const { logCreate, logTip } = require('./CliHelper');
const Generator = {};

/**
 * 创建项目
 * @param {Object} params
 * @param {String} params.projectDir                项目目录
 * @param {String} params.appName                   工程名称
 * @param {String} params.viewEngine                模板引擎
 * @param {String} params.cssEngine                 css 引擎
 * @param {Boolean} params.forceNonEmptyDir         是否强制非空目录创建
 * @param {Boolean} params.addGitIgnore             是否添加 .gitignore 文件
 * @return {Promise<void>}
 */
Generator.generatorProject = async params => {
    // 创建目录
    await Generator.createDirectors(params);
    await Generator.createCssFiles(params);
    await Generator.createViewFiles(params);
    await Generator.createTSFiles(params);
    await Generator.createPackageJsonAndTsConfigJson(params);
    await Generator.createGitIgnoreFile(params);

    logTip(`
    install dependencies:
        $ cd ${params.appName} && npm install 
        
    run the app:
        $ npm run start
    `)
};

/**
 * 创建项目文件目录结构
 *
 * @param params
 * @param {String} params.projectDir                项目目录
 * @return {Promise<void>}
 */
Generator.createDirectors = async params => {
    const { projectDir } = params;
    await fse.ensureDir(projectDir);
    logCreate(projectDir);

    // build
    const distDir = path.resolve(projectDir, './dist');
    await fse.ensureDir(distDir);
    logCreate(distDir);

    // static
    const publicDir = path.resolve(projectDir, './src/public');
    const publicImgDir = path.resolve(projectDir, './src/public/images');
    const publicJsDir = path.resolve(projectDir, './src/public/javascripts');
    const publicStyleDir = path.resolve(projectDir, './src/public/stylesheets');
    await fse.ensureDir(publicDir);
    await fse.ensureDir(publicImgDir);
    await fse.ensureDir(publicJsDir);
    await fse.ensureDir(publicStyleDir);
    logCreate(publicDir);
    logCreate(publicImgDir);
    logCreate(publicJsDir);
    logCreate(publicStyleDir);

    // views
    const viewsDir = path.resolve(projectDir, './src/views');
    await fse.ensureDir(viewsDir);
    logCreate(viewsDir);

    // ts
    const routesDir = path.resolve(projectDir, './src/routes');
    const binDir = path.resolve(projectDir, './src/bin');
    await fse.ensureDir(routesDir);
    await fse.ensureDir(binDir);
    logCreate(routesDir);
    logCreate(binDir);

};

/**
 * 创建样式文件
 *
 * @param {Object} params
 * @param {String} params.projectDir                项目目录
 * @param {String} params.appName                   工程名称
 * @param {String} params.cssEngine                 css 引擎
 * @return {Promise<void>}
 */
Generator.createCssFiles = async params => {
    const { projectDir, cssEngine } = params;

    const destination = path.resolve(projectDir, `./src/public/stylesheets/style.${cssEngine}`);
    const cssTemplate = path.resolve(__dirname, `../template/css/${cssEngine}/style.${cssEngine}`);
    await fse.copy(cssTemplate, destination);
    logCreate(destination);
};

/**
 * 创建视图文件
 *
 * @param {Object} params
 * @param {String} params.projectDir                项目目录
 * @param {String} params.appName                   工程名称
 * @param {String} params.viewEngine                模板引擎
 * @return {Promise<void>}
 */
Generator.createViewFiles = async params => {
    const { projectDir, viewEngine } = params;

    const destination = path.resolve(projectDir, `./src/views`);
    const viewTemplate = path.resolve(__dirname, `../template/view/${viewEngine}`);
    await fse.copy(viewTemplate, destination);
    logCreate(destination);
};

/**
 * 创建项目 ts 文件
 *
 * @param {Object} params
 * @param {String} params.projectDir                项目目录
 * @param {String} params.appName                   工程名称
 * @param {String} params.viewEngine                模板引擎
 * @return {Promise<void>}
 */
Generator.createTSFiles = async params =>  {
    const { projectDir, viewEngine } = params;

    const destination = path.resolve(projectDir, './src');
    const tsTemplate = path.resolve(__dirname, `../template/ts`);
    await fse.copy(tsTemplate, destination);

    const app = path.resolve(destination, `app.ts`);
    let content = fs.readFileSync(app, 'utf-8');
    content = content.replace(/\${viewEngine}/g, viewEngine);
    fs.writeFileSync(app, content);
    logCreate(destination);
    logCreate(`${destination}/bin/www.ts`);
    logCreate(`${destination}/routes/index.ts`);
    logCreate(`${destination}/routes/users.ts`);
    logCreate(`${destination}/app.ts`);
};

/**
 * 创建项目 package.json, tsconfig.json 文件
 * @param {Object} params
 * @param {String} params.projectDir                项目目录
 * @param {String} params.appName                   工程名称
 * @param {String} params.viewEngine                模板引擎
 * @param {String} params.cssEngine                 css 引擎
 * @return {Promise<void>}
 */
Generator.createPackageJsonAndTsConfigJson = async params => {

    const { projectDir, appName, viewEngine, cssEngine } = params;

    const packJsonPath = path.resolve(__dirname, `../template/config/package.json`);
    const packJsonObj = await fse.readJson(packJsonPath);
    packJsonObj.name = appName;
    packJsonObj.dependencies[viewEngine] = '*';
    packJsonObj.devDependencies[`@types/${viewEngine}`] = '*';
    const packJsonStr = JSON.stringify(packJsonObj, null, 4);
    fs.writeFileSync(path.resolve(projectDir, 'package.json'), packJsonStr);
    logCreate(`package.json`);

    const tsJsonPath = path.resolve(__dirname, `../template/config/tsconfig.json`);
    await fse.copy(tsJsonPath, path.resolve(projectDir, 'tsconfig.json'));
    logCreate(`tsconfig.json`);

};

/**
 * 创建项目的 .gitignore 文件
 * @param {Object} params
 * @param {String} params.projectDir                项目目录
 * @param {Boolean} params.addGitIgnore             是否添加 .gitignore 文件
 * @return {Promise<void>}
 */
Generator.createGitIgnoreFile = async params => {
    const { projectDir, addGitIgnore } = params;
    if (!addGitIgnore) return ;

    const destination = path.resolve(projectDir, `.gitignore`);
    const gitignore = path.resolve(__dirname, `../template/config/.gitignore`);
    await fse.copy(gitignore, destination);
    logCreate(destination);
};




module.exports = Generator;
