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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Path = __importStar(require("path"));
const replacer = (params) => {
    return [
        {
            file: './README.md',
            replaces: {
                projectName: params.projectName,
                systemName: params.systemName
            }
        },
        {
            file: './package.json',
            replaces: {
                projectName: params.projectName
            }
        },
        {
            file: './build/index.js',
            replaces: {
                apiPrefix: formatApiPrefix(params.apiPrefix),
                systemName: params.systemName
            }
        }
    ];
};
function formatApiPrefix(arr) {
    return JSON.stringify(arr).replace(/"/g, '\'').replace(/,/g, ', ');
}
async function replaceHandler(options, projectPath) {
    const filepath = Path.join(projectPath, options.file + '.tpl');
    let content = await fs_1.promises.readFile(filepath, 'utf8');
    Object.entries(options.replaces).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
    });
    await fs_1.promises.writeFile(Path.join(projectPath, options.file), content);
    await fs_1.promises.unlink(filepath);
}
exports.default = async (params, projectPath) => {
    const list = replacer(params);
    for (const item of list) {
        await replaceHandler(item, projectPath);
    }
};
