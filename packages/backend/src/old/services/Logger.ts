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

  error(action: string, error: unknown) {
    if (this.enabled) {
      const t = chalk.gray(`[${time()}]`)
      const l = chalk.red('ERROR')
      const message = error instanceof Error ? error.message : '' + error
      console.error(`${t} ${l} ${action} ${message}`)
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
