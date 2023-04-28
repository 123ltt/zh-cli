"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.default = async (command, cwd = process.cwd(), callback) => {
    return new Promise((resolve, reject) => {
        const mapping = {};
        let count = 0;
        command = command.replace(/(['"][^'"]+['"])/g, matched => {
            const key = `__${count}__`;
            mapping[key] = matched;
            count++;
            return key;
        });
        const arr = command.split(/\s+/).map(s => mapping[s] || s);
        const ls = child_process_1.spawn(arr[0], arr.slice(1), { cwd, env: process.env, shell: true });
        ls.stdout.on('message', (message) => {
            callback && callback(message, 'stdout');
        });
        ls.stderr.on('message', (message) => {
            callback && callback(message, 'stderr');
        });
        ls.once('close', resolve);
        ls.once('error', reject);
    });
};
