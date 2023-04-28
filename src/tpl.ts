import { promises as Fs } from 'fs'
import * as Path from 'path'

type TplData = {
  systemName: string;
  apiPrefix: string[][];
  projectName: string;
}

type ReplaceItem = {
  file: string;
  replaces: { [key: string]: string };
}

const replacer = (params: TplData): ReplaceItem[] => {
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
  ]
}

function formatApiPrefix (arr: string[][]) {
  return JSON.stringify(arr).replace(/"/g, '\'').replace(/,/g, ', ')
}

async function replaceHandler (options: ReplaceItem, projectPath: string) {
  const filepath = Path.join(projectPath, options.file + '.tpl')
  let content = await Fs.readFile(filepath, 'utf8')
  Object.entries(options.replaces).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value)
  })
  await Fs.writeFile(Path.join(projectPath, options.file), content)
  await Fs.unlink(filepath)
}

export default async (params: TplData, projectPath: string) => {
  const list = replacer(params)
  for (const item of list) {
    await replaceHandler(item, projectPath)
  }
}
