import chalk from 'chalk'

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  constructor(private logLevel: LogLevel) {}

  error(error: string | Error) {
    if (this.logLevel >= LogLevel.ERROR) {
      const message = typeof error === 'string' ? error : error.message
      console.error(
        getTime(),
        chalk.hex('#000000').bgRed(' ERROR '),
        chalk.red(message)
      )
    }
  }

  info(message: string) {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(getTime(), chalk.blue('INFO'), message)
    }
  }

  debug(message: string) {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.debug(getTime(), chalk.yellow('DEBUG'), message)
    }
  }
}

function getTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return chalk.gray(`${hours}:${minutes}:${seconds}`)
}
