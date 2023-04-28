"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.error = exports.existDir = exports.readJsonFile = exports.readFile = void 0;
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
async function readFile(filepath) {
    try {
        return fs_1.promises.readFile(filepath, 'utf8');
    }
    catch (err) {
        return null;
    }
}
exports.readFile = readFile;
async function readJsonFile(filepath) {
    const content = await readFile(filepath);
    return content ? JSON.parse(content) : null;
}
exports.readJsonFile = readJsonFile;
async function exist(path) {
    try {
        const stat = await fs_1.promises.stat(path);
        return stat.isFile() ? 1 : 2;
    }
    catch (err) {
        return 0;
    }
}
async function existDir(dirpath) {
    return await exist(dirpath) === 2;
}
exports.existDir = existDir;
function error(...args) {
    return chalk_1.default.white.bgRed(...args);
}
exports.error = error;
function success(...args) {
    return chalk_1.default.white.bgGreen(...args);
}
exports.success = success;
