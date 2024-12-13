import { formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { partition } from 'lodash'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { Analysis } from '../analysis/AddressAnalyzer'

export function printTemplatization(
  logger: DiscoveryLogger,
  analyses: Analysis[],
) {
  const contracts = analyses.filter((a) => a.type === 'Contract')
  const [templetized, untempletized] = partition(
    contracts,
    (c) => c.extendedTemplate !== undefined,
  )

  if (untempletized.length === 0) {
    const rawLog = `All ${templetized.length} contracts are templetized`
    const log = chalk.bgMagenta(chalk.greenBright(chalk.bold(rawLog)))
    logger.log(log)
    return
  }

  if (templetized.length === 0) {
    const rawLog = `All ${untempletized.length} contracts are untempletized`
    const log = chalk.bgCyanBright(chalk.redBright(chalk.bold(rawLog)))
    logger.log(log)
    return
  }

  const logs = []
  logs.push(chalk.greenBright(chalk.bold('Templetized')))
  for (const [i, contract] of templetized.entries()) {
    const prefix = i === templetized.length - 1 ? `└─` : `├─`
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

  logs.push(chalk.redBright(chalk.bold('Untempletized')))
  for (const [i, contract] of untempletized.entries()) {
    const prefix = i === untempletized.length - 1 ? `└─` : `├─`
    const indent = ' '.repeat(2)
    const name = chalk.blue(contract.name)
    const log = `${contract.address} ${name}`
    logs.push(`${indent}${chalk.gray(prefix)} ${log}`)
  }

  logger.log(formatAsciiBorder(logs, true))
}
