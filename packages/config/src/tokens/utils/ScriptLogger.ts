import chalk from 'chalk'

export class ScriptLogger {
  notify(notification: string, ...messages: string[]) {
    console.log(chalk.yellow(notification) + ' ', ...messages)
  }

  success(notification: string, ...messages: string[]) {
    console.log(chalk.green(notification) + ' ', ...messages)
  }

  skipping(...messages: string[]) {
    console.log(chalk.gray('Skipping'), ...messages)
  }

  fetching(...messages: string[]) {
    console.log(chalk.blue('Fetching... '), ...messages)
  }

  processing(...messages: string[]) {
    console.log(chalk.yellow('\nProcessing... '), ...messages)
  }

  processed(...messages: string[]) {
    console.log(chalk.green('Processed '), ...messages)
  }

  assert(condition: boolean, ...messages: string[]): asserts condition {
    if (condition) return

    console.log(chalk.red('Error '), ...messages)

    console.log('\n')
    process.exit(1)
  }
}
