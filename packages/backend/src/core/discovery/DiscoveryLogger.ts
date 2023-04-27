import { EthereumAddress } from '@l2beat/shared'
import chalk from 'chalk'

interface LoggerOptions {
  enabled: boolean
}

export class DiscoveryLogger {
  constructor(private readonly options: LoggerOptions) {}

  static SILENT = new DiscoveryLogger({ enabled: false })

  log(message: string) {
    if (!this.options.enabled) {
      return
    }

    console.log(message)
  }

  logExecution(field: string, values: string[]) {
    if (!this.options.enabled) {
      return
    }

    const dots = '.'.repeat(Math.max(1, 25 - field.length))
    const content = values
      .map((v, i) => (i % 2 === 0 ? v : chalk.blue(v)))
      .join('')

    console.log(`  ${chalk.yellow(field)} ${chalk.gray(dots)} ${content}`)
  }

  logSkip(address: EthereumAddress, reason: string) {
    this.log(`Skipping ${address.toString()}`)
    if (reason.startsWith('Error: ')) {
      const message = reason.slice('Error: '.length)
      this.log(`  Error: ${chalk.red(message)}`)
    } else {
      this.log(`  Reason: ${reason}`)
    }
    this.log('')
  }

  logRelatives(relatives: EthereumAddress[]) {
    if (relatives.length > 0) {
      this.log(`  New relatives found: ${relatives.length}`)
      for (const relative of relatives) {
        this.log(`    - ${relative.toString()}`)
      }
    }
    this.log('')
  }

  logEoa() {
    this.log(`  Type: ${chalk.blue('EOA')}`)
  }

  logName(name: string) {
    this.log(`  Name: ${chalk.bold(name)}`)
  }

  logConfiguredButUndiscovered(override: string) {
    this.log(
      `${chalk.red('Override for')} ${chalk.bold(override)} ${chalk.red(
        'was configured, but the address was not discovered',
      )}`,
    )
  }

  logProxyDetected(type: string) {
    this.log(`  Proxy detected: ${chalk.bgRed.whiteBright(` ${type} `)}`)
  }

  logProxyDetectionFailed(type: string) {
    this.log(
      `  Manual proxy detection failed: ${chalk.bgRed.whiteBright(
        ` ${type} `,
      )}`,
    )
  }
}
