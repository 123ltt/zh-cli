# 生成子项目脚手架

## 全局安装
> 本地git仓库安装
```bash
# 确保 nodejs 版本在14.14.0及以上 
npm i -g git+http://gitlab.zehui.local/caohuichang/zh-cli.git
```

## 使用
1. 在GitLab的`frond-end`组创建一个空仓库`zh-xxx`
2. 全局安装zh-cli脚手架工具
3. 创建 zh-xxx 项目
```bash
# 创建 zh-xxx 项目 (执行脚本前确定cmd所在的路径)
zh create zh-xxx
```
4. 进入到 zh-xxx 项目，查看`README.md`文档文件，根据文档进行下一步操作