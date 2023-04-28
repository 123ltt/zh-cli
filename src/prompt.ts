import inquirer from 'inquirer'
import chalk from 'chalk'

const confirmQs = (projectName: string) => [
  {
    type: 'confirm',
    name: 'confirmPath',
    message: `将会在 ${chalk.green(process.cwd())} 目录下创建 ${chalk.green(projectName)} 项目，是否继续？`
  }
]

const questions = (projectName: string) => [
  {
    type: 'confirm',
    name: 'isCreateRemote',
    message: `是否已在GitLab创建 ${chalk.green('font-end/' + projectName)} 仓库`
  },
  {
    type: 'input',
    name: 'systemName',
    message: '请输入系统名称（views目录下对应的目录名），如：`pms`',
    validate (value: string) {
      if (/^[a-z-]+$/i.test(value)) return true
      return '系统名称必须是字母、- ，请重新输入'
    },
    filter (value: string) {
      return value.trim()
    }
  },
  {
    type: 'input',
    name: 'apiPrefix',
    message: '请输入api前缀映射关系，格式为`$pms=pms`，多个使用`,`隔开',
    validate (value: string) {
      if (/^\$[a-z]+=[\w-]+(,\$[a-z]+=[\w-]+)*$/.test(value)) {
        return true
      }
      return '输入的格式错误，请重新输入'
    }
  }
]

export type Params = {
  isCreateRemote: boolean;
  systemName: string;
  apiPrefix: string;
}

export default async (projectName: string) => {
  return inquirer.prompt(confirmQs(projectName)).then((answers: { confirmPath: boolean }) => {
    if (answers.confirmPath) {
      return inquirer.prompt(questions(projectName)).then((answers: Params) => {
        const apiPrefix = answers.apiPrefix.replace(/\s+/g, '').split(',').reduce((prev, item) => {
          const arr = item.split('=')
          prev.push(arr)
          return prev
        }, [] as string[][])
        return Object.assign({}, answers, { apiPrefix })
      })
    } else {
      process.exit()
    }
  })
}
