"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Path = __importStar(require("path"));
const fs_1 = require("fs");
const ora_1 = __importDefault(require("ora"));
const util_1 = require("./util");
const prompt_1 = __importDefault(require("./prompt"));
const tpl_1 = __importDefault(require("./tpl"));
const exec_1 = __importDefault(require("./exec"));
exports.default = async () => {
    const program = new commander_1.Command();
    const pkg = await util_1.readJsonFile(Path.join(__dirname, '../package.json'));
    program.version(pkg.version);
    program
        .command('create <project-name> [template]')
        .description('create a project. eg. `zh-ams`')
        .action(async (projectName, template = 'caohuichang/zh-template') => {
        if (!/^zh-[a-zA-Z\d-]/.test(projectName))
            return console.log(util_1.error(' Fail '), '项目名称格式必须为`zh-xxx`');
        const rootDir = process.cwd();
        if (await util_1.existDir(Path.join(rootDir, projectName))) {
            return console.log(util_1.error(' Fail '), `目录${projectName}已存在`);
        }
        const tplGitUrl = `http://gitlab.zehui.local/${template}.git`;
        const tplName = (tplGitUrl.match(/([^/]+)\.git$/i) || [])[1];
        const projectPath = Path.join(rootDir, projectName);
        const params = await prompt_1.default(projectName);
        const spinner = ora_1.default('').start();
        const totalStep = params.isCreateRemote ? 3 : 2;
        try {
            spinner.text = `[1/${totalStep}] cloning repository...`;
            await exec_1.default(`git clone ${tplGitUrl}`, rootDir, console.log);
            await fs_1.promises.rename(Path.join(rootDir, tplName), projectPath);
            await tpl_1.default({ ...params, projectName }, projectPath);
            await fs_1.promises.rmdir(Path.join(projectPath, '.git'), { recursive: true });
            spinner.text = `[2/${totalStep}] npm installing...`;
            await exec_1.default('npm i', projectPath);
            await exec_1.default('npm run dev --unwatch', projectPath);
            await exec_1.default('git init -b master', projectPath);
            await exec_1.default('git add .', projectPath);
            await exec_1.default('git commit -am "init files"', projectPath);
            if (params.isCreateRemote) {
                spinner.text = `[3/${totalStep}] git pushing...`;
                await exec_1.default(`git remote add origin ssh://git@gitlab.zehui.local:30022/front-end/${projectName}.git`, projectPath);
                await exec_1.default('git push -u origin master', projectPath);
            }
            spinner.succeed('Success.');
        }
        catch (err) {
            console.error(err);
            spinner.fail('Fail.');
        }
    });
    program.parse(process.argv);
};
