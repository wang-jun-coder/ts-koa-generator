const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const FileHelper = {};

FileHelper.getVersion = async () => {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJsonStr = fs.readFileSync(packageJsonPath);
    const pack = JSON.parse(packageJsonStr);
    return pack.version;
};

/**
 * 检查文件目录是否为空
 *
 * @param {String} dir 文件目录
 * @return {Promise<boolean>}
 */
FileHelper.dirIsEmpty = async dir => {
    let isEmpty = true;
    if (!fs.existsSync(dir)) return isEmpty;

    return new Promise((resolve, reject) => {
        fs.readdir(dir, (error, files) => {
            if (error) return reject(error);
            if (files && files.length) {
                isEmpty = false;
            }
            return  resolve(isEmpty);
        })
    });
};

/**
 * 将字符串写入指定路径(文件路径)
 *
 * @param {String} str 要写入的字符串
 * @param {String} path 指定的文件路径
 * @return {Promise<void>}
 */
FileHelper.writeStringToPath = async (str, path) => {
    fs.writeFileSync(path, str);
};

/**
 * 根据文件全路径获取 app 名称
 * @param pathName 文件全路径
 * @return {Promise<string>}
 */
FileHelper.getAppNameWithPath = (pathName) => {
    return  path.basename(pathName)
        .replace(/[^A-Za-z0-9\.()!~*'-]+/g, '-')
        .replace(/^[-_\.]+|-+$/g, '')
        .toLowerCase();
};

module.exports = FileHelper;
