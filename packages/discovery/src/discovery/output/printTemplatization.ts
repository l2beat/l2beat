import { formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { partition } from 'lodash'
import type { DiscoveryLogger } from '../DiscoveryLogger'
import type { Analysis } from '../analysis/AddressAnalyzer'

export function printTemplatization(
  logger: DiscoveryLogger,
  analyses: Analysis[],
  verbose: boolean,
) {
  const contracts = analyses.filter((a) => a.type === 'Contract')
  const [templatized, untemplatized] = partition(
    contracts,
    (c) => c.extendedTemplate !== undefined,
  )

  if (untemplatized.length === 0) {
    const rawLog = `All ${templatized.length} contracts are templatized`
    const log = chalk.bgMagenta(chalk.greenBright(chalk.bold(rawLog)))
    logger.log(log)
    return
  }

  if (templatized.length === 0) {
    const rawLog = `All ${untemplatized.length} contracts are untemplatized`
    const log = chalk.bgCyanBright(chalk.redBright(chalk.bold(rawLog)))
    logger.log(log)
    return
  }

  const logs = []
  if (verbose) {
    logs.push(chalk.greenBright(chalk.bold('Templatized')))
    for (const [i, contract] of templatized.entries()) {
      const prefix = i === templatized.length - 1 ? `└─` : `├─`
      const indent = ' '.repeat(2)
      const name = chalk.blue(contract.name)
      const template = `${contract.extendedTemplate?.template} ${contract.extendedTemplate?.reason}`
      const templateColor =
        contract.extendedTemplate?.reason === 'byShapeMatch'
          ? chalk.green(template)
          : chalk.yellow(template)

      const log = `${contract.address} ${name} [${templateColor}]`
      logs.push(`${indent}${chalk.gray(prefix)} ${log}`)
    }
  }

  logs.push(chalk.redBright(chalk.bold('Untemplatized')))
  for (const [i, contract] of untemplatized.entries()) {
    const prefix = i === untemplatized.length - 1 ? `└─` : `├─`
    const indent = ' '.repeat(2)
    const name = chalk.blue(contract.name)
    const log = `${contract.address} ${name}`
    logs.push(`${indent}${chalk.gray(prefix)} ${log}`)
  }

  logger.log(formatAsciiBorder(logs, true))
}
