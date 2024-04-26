import chalk from 'chalk'

import { LogLevel } from './LogLevel'

export function formatLevelPretty(level: LogLevel, colors: boolean): string {
  if (colors) {
    switch (level) {
      case 'CRITICAL':
      case 'ERROR':
        return chalk.red(chalk.bold(level.toUpperCase()))
      case 'WARN':
        return chalk.yellow(chalk.bold(level.toUpperCase()))
      case 'INFO':
        return chalk.green(chalk.bold(level.toUpperCase()))
      case 'DEBUG':
        return chalk.magenta(chalk.bold(level.toUpperCase()))
      case 'TRACE':
        return chalk.gray(chalk.bold(level.toUpperCase()))
    }
  }
  return level.toUpperCase()
}
