import { spawn } from 'child_process'

type Callback = (message: string, type: 'stdout' | 'stderr') => void

export default async (command: string, cwd = process.cwd(), callback?: Callback) => {
  return new Promise((resolve, reject) => {
    const mapping: { [key: string]: string } = {}
    let count = 0
    command = command.replace(/(['"][^'"]+['"])/g, matched => {
      const key = `__${count}__`
      mapping[key] = matched
      count++
      return key
    })

    const arr = command.split(/\s+/).map(s => mapping[s] || s)

    const ls = spawn(arr[0], arr.slice(1), { cwd, env: process.env, shell: true })

    ls.stdout.on('message', (message) => {
      callback && callback(message, 'stdout')
    })

    ls.stderr.on('message', (message) => {
      callback && callback(message, 'stderr')
    })

    ls.once('close', resolve)

    ls.once('error', reject)
  })
}
