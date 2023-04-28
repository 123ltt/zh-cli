import { Command } from 'commander'
import * as Path from 'path'
import { promises as Fs } from 'fs'
import ora from 'ora'
import { readJsonFile, error, existDir } from './util'
import prompt from './prompt'
import tpl from './tpl'
import exec from './exec'

export default async () => {
  const program = new Command()
  const pkg = await readJsonFile(Path.join(__dirname, '../package.json'))

  program.version(pkg.version)

  program
    .command('create <project-name> [template]')
    .description('create a project. eg. `zh-ams`')
    .action(async (projectName: string, template = 'caohuichang/zh-template') => {
      if (!/^zh-[a-zA-Z\d-]/.test(projectName)) return console.log(error(' Fail '), '项目名称格式必须为`zh-xxx`')
      const rootDir = process.cwd()

      if (await existDir(Path.join(rootDir, projectName))) {
        return console.log(error(' Fail '), `目录${projectName}已存在`)
      }

      const tplGitUrl = `http://gitlab.zehui.local/${template}.git`
      const tplName = (tplGitUrl.match(/([^/]+)\.git$/i) || [])[1]
      const projectPath = Path.join(rootDir, projectName)
      const params = await prompt(projectName)
      const spinner = ora('').start()
      const totalStep = params.isCreateRemote ? 3 : 2

      try {
        spinner.text = `[1/${totalStep}] cloning repository...`
        await exec(`git clone ${tplGitUrl}`, rootDir, console.log)

        await Fs.rename(Path.join(rootDir, tplName), projectPath)
        await tpl({ ...params, projectName }, projectPath)
        await Fs.rmdir(Path.join(projectPath, '.git'), { recursive: true })

        spinner.text = `[2/${totalStep}] npm installing...`
        await exec('npm i', projectPath)
        await exec('npm run dev --unwatch', projectPath)

        await exec('git init -b master', projectPath)
        await exec('git add .', projectPath)
        await exec('git commit -am "init files"', projectPath)

        if (params.isCreateRemote) {
          spinner.text = `[3/${totalStep}] git pushing...`
          await exec(`git remote add origin ssh://git@gitlab.zehui.local:30022/front-end/${projectName}.git`, projectPath)
          await exec('git push -u origin master', projectPath)
        }
        spinner.succeed('Success.')
      } catch (err) {
        console.error(err)
        spinner.fail('Fail.')
      }
    })

  program.parse(process.argv)
}
