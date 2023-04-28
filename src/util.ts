import { promises as Fs } from 'fs'
import chalk from 'chalk'

export async function readFile (filepath: string) {
  try {
    return Fs.readFile(filepath, 'utf8')
  } catch (err) {
    return null
  }
}

export async function readJsonFile (filepath: string) {
  const content = await readFile(filepath)
  return content ? JSON.parse(content) : null
}

async function exist (path: string) {
  try {
    const stat = await Fs.stat(path)
    return stat.isFile() ? 1 : 2
  } catch (err) {
    return 0
  }
}

export async function existDir (dirpath: string) {
  return await exist(dirpath) === 2
}

export function error (...args: string[]) {
  return chalk.white.bgRed(...args)
}

export function success (...args: string[]) {
  return chalk.white.bgGreen(...args)
}
