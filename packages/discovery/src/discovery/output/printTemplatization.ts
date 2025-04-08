import { formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { partition } from 'lodash'
import type { DiscoveryLogger } from '../DiscoveryLogger'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { TemplateService } from '../analysis/TemplateService'
import { getShapeFromAnalyzedContract } from '../analysis/findShape'

export function printTemplatization(
  logger: DiscoveryLogger,
  analyses: Analysis[],
  verbose: boolean,
  templateService: TemplateService,
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
  }

  if (templatized.length === 0) {
    const rawLog = `All ${untemplatized.length} contracts are untemplatized`
    const log = chalk.bgCyanBright(chalk.redBright(chalk.bold(rawLog)))
    logger.log(log)
  }

  const logs = []
  if (verbose) {
    logs.push(chalk.greenBright(chalk.bold('Templatized')))
    for (const [i, contract] of templatized.entries()) {
      const matchedShape = getShapeFromAnalyzedContract(
        templateService,
        contract,
      )
      const firstLinePrefix = i === templatized.length - 1 ? `└─` : `├─`
      const nestedLinePrefix = i === templatized.length - 1 ? `  ` : `│ `
      const indent = ' '.repeat(2)
      const name = chalk.blue(contract.name)
      const template = `${contract.extendedTemplate?.template} ${contract.extendedTemplate?.reason}`
      const templateColor =
        contract.extendedTemplate?.reason === 'byShapeMatch'
          ? chalk.green(template)
          : chalk.yellow(template)

      const nestedLines = matchedShape
        ? [
            matchedShape.description,
            `${matchedShape.chain} @ ${matchedShape.blockNumber} (${matchedShape.address})`,
            `hash: ${matchedShape.hash}`,
          ]
        : []

      const shapeData = nestedLines.map(
        (line, index) =>
          `${indent}${chalk.gray(`${nestedLinePrefix} ${index === nestedLines.length - 1 ? '└─' : '├─'} `)}${chalk.italic(
            chalk.green(line),
          )}`,
      )

      const log = `${contract.address} ${name} [${templateColor}]`
      logs.push(`${indent}${chalk.gray(firstLinePrefix)} ${log}`)

      if (shapeData) {
        logs.push(...shapeData)
      }
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
