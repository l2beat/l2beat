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

  error(message: string) {
    this.log(`  Error: ${chalk.red(message)}`)
  }

  eoa() {
    this.log(`  Type: ${chalk.blue('EOA')}`)
  }

  name(name: string) {
    this.log(`  Name: ${chalk.bold(name)}`)
  }

  configuredButUndiscovered(override: string) {
    this.log(
      `${chalk.red('Override for')} ${chalk.bold(override)} ${chalk.red(
        'was configured, but the address was not discovered',
      )}`,
    )
  }

  proxyDetected(type: string) {
    this.log(`  Proxy detected: ${chalk.bgRed.whiteBright(` ${type} `)}`)
  }

  proxyDetectionFailed(type: string) {
    this.log(
      `  Manual proxy detection failed: ${chalk.bgRed.whiteBright(
        ` ${type} `,
      )}`,
    )
  }
}
