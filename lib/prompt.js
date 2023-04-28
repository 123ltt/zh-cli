"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const confirmQs = (projectName) => [
    {
        type: 'confirm',
        name: 'confirmPath',
        message: `将会在 ${chalk_1.default.green(process.cwd())} 目录下创建 ${chalk_1.default.green(projectName)} 项目，是否继续？`
    }
];
const questions = (projectName) => [
    {
        type: 'confirm',
        name: 'isCreateRemote',
        message: `是否已在GitLab创建 ${chalk_1.default.green('font-end/' + projectName)} 仓库`
    },
    {
        type: 'input',
        name: 'systemName',
        message: '请输入系统名称（views目录下对应的目录名），如：`pms`',
        validate(value) {
            if (/^[a-z-]+$/i.test(value))
                return true;
            return '系统名称必须是字母、- ，请重新输入';
        },
        filter(value) {
            return value.trim();
        }
    },
    {
        type: 'input',
        name: 'apiPrefix',
        message: '请输入api前缀映射关系，格式为`$pms=pms`，多个使用`,`隔开',
        validate(value) {
            if (/^\$[a-z]+=[\w-]+(,\$[a-z]+=[\w-]+)*$/.test(value)) {
                return true;
            }
            return '输入的格式错误，请重新输入';
        }
    }
];
exports.default = async (projectName) => {
    return inquirer_1.default.prompt(confirmQs(projectName)).then((answers) => {
        if (answers.confirmPath) {
            return inquirer_1.default.prompt(questions(projectName)).then((answers) => {
                const apiPrefix = answers.apiPrefix.replace(/\s+/g, '').split(',').reduce((prev, item) => {
                    const arr = item.split('=');
                    prev.push(arr);
                    return prev;
                }, []);
                return Object.assign({}, answers, { apiPrefix });
            });
        }
        else {
            process.exit();
        }
    });
};
