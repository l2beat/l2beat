import chalk from 'chalk'

export class ScriptLogger {
  notify(notification: string, message: string) {
    console.log(chalk.yellow(notification) + message)
  }

  success(notification: string, message: string) {
    console.log(chalk.green(notification) + message + '\n')
  }

  check(condition: boolean, message: string) {
    if (condition) return

    console.log(chalk.red('Error ') + message + '\n')
    process.exit(1)
  }
}
