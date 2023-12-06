import chalk from 'chalk'

import { EthereumAddress } from '../utils/EthereumAddress'

interface LoggerOptions {
  buffered: boolean
  enabled: boolean
}

export class DiscoveryLogger {
  private bufferedLogs = ''

  constructor(private readonly options: LoggerOptions) {}

  static SILENT = new DiscoveryLogger({ enabled: false, buffered: false })
  static CLI = new DiscoveryLogger({ enabled: true, buffered: false })
  static SERVER = new DiscoveryLogger({ enabled: false, buffered: true })

  flushServer(project: string): void {
    this.flush(`Printing discovery logs for [${project}]:`)
  }

  flushToLogger(logger: DiscoveryLogger): void {
    if (!this.options.buffered) {
      return
    }
    logger.log(this.bufferedLogs)
    this.bufferedLogs = ''
  }

  flush(log?: string): void {
    if (!this.options.buffered) {
      return
    }
    if (log) {
      console.log(log)
    }
    console.log(this.bufferedLogs)
    this.bufferedLogs = ''
  }

  log(message: string): void {
    if (this.options.buffered) {
      this.bufferedLogs += message + '\n'
    }

    if (!this.options.enabled) {
      return
    }

    console.log(message)
  }

  logExecution(field: string, values: string[]): void {
    const content = values
      .map((v, i) => (i % 2 === 0 ? v : chalk.blue(v)))
      .join('')

    this.log(`  ${chalk.yellow(field)} ${dots(25 - field.length)} ${content}`)
  }

  logWarning(warning: string): void {
    this.log(`${chalk.yellow(warning)}`)
  }

  logExecutionError(field: string, error: string): void {
    const prefix = 'Error: ' + field
    this.log(`  ${chalk.red(prefix)} ${dots(25 - prefix.length)} ${error}`)
  }

  logError(error: string): void {
    this.log(`${chalk.red(error)}`)
  }

  logSkip(address: EthereumAddress, reason: string): void {
    this.log(`Skipping ${address.toString()}`)
    if (reason.startsWith('Error: ')) {
      const message = reason.slice('Error: '.length)
      this.log(`  Error: ${chalk.red(message)}`)
    } else {
      this.log(`  Reason: ${reason}`)
    }
    this.log('')
  }

  logRelatives(relatives: EthereumAddress[]): void {
    if (relatives.length > 0) {
      this.log(`  New relatives found: ${relatives.length}`)
      for (const relative of relatives) {
        this.log(`    - ${relative.toString()}`)
      }
    }
    this.log('')
  }

  logEoa(): void {
    this.log(`  Type: ${chalk.blue('EOA')}`)
  }

  logName(name: string): void {
    this.log(`  Name: ${chalk.bold(name)}`)
  }

  logConfiguredButUndiscovered(override: string): void {
    this.log(
      `${chalk.red('Override for')} ${chalk.bold(override)} ${chalk.red(
        'was configured, but the address was not discovered',
      )}`,
    )
  }

  logProxyDetected(type: string): void {
    this.log(`  Proxy detected: ${chalk.bgRed.whiteBright(` ${type} `)}`)
  }

  logProxyDetectionFailed(type: string): void {
    this.log(
      `  Manual proxy detection failed: ${chalk.bgRed.whiteBright(
        ` ${type} `,
      )}`,
    )
  }

  logFetchingEvents(fromBlock: number, toBlock: number): void {
    const text = `Fetching events in range ${fromBlock} - ${toBlock}`
    this.log(`  ${chalk.gray(text)}`)
  }
}

function dots(length: number): string {
  return chalk.grey('.'.repeat(Math.max(1, length)))
}
