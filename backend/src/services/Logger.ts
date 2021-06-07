import chalk from 'chalk'

export class Logger {
  constructor(private enabled = true) {}

  log(message: string) {
    if (this.enabled) {
      const t = chalk.gray(`[${time()}]`)
      const l = chalk.blue('LOG')
      console.log(`${t} ${l} ${message}`)
    }
  }
}

function time() {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  const s = now.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
