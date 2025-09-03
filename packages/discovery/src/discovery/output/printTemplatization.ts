import type { Logger } from '@l2beat/backend-tools'
import { formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import partition from 'lodash/partition'
import type { Analysis } from '../analysis/AddressAnalyzer'
import { getShapeFromAnalyzedContract } from '../analysis/findShape'
import type { TemplateService } from '../analysis/TemplateService'
import type { ColorConfig } from '../config/ColorConfig'
import { makeEntryColorConfig } from '../config/colorUtils'

export function printTemplatization(
  logger: Logger,
  analyses: Analysis[],
  verbose: boolean,
  colorConfig: ColorConfig,
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
    logger.info(log)
  }

  if (templatized.length === 0) {
    const rawLog = `All ${untemplatized.length} contracts are untemplatized`
    const log = chalk.bgCyanBright(chalk.redBright(chalk.bold(rawLog)))
    logger.info(log)
  }

  const logs = []
  if (verbose) {
    logs.push(chalk.greenBright(chalk.bold('Templatized')))
    for (const [i, contract] of templatized.entries()) {
      const matchedShape = getShapeFromAnalyzedContract(
        templateService,
        contract,
      )

      const entryConfig = makeEntryColorConfig(
        colorConfig,
        contract.address,
        templateService.loadContractTemplateColor(
          contract.extendedTemplate?.template,
        ),
      )

      const firstLinePrefix = i === templatized.length - 1 ? '└─' : '├─'
      const nestedLinePrefix = i === templatized.length - 1 ? '  ' : '│ '
      const indent = ' '.repeat(2)
      const name = chalk.blue(
        entryConfig.name ?? entryConfig.displayName ?? contract.name,
      )
      const template = `${contract.extendedTemplate?.template} ${contract.extendedTemplate?.reason}`
      const templateColor =
        contract.extendedTemplate?.reason === 'byShapeMatch'
          ? chalk.green(template)
          : chalk.yellow(template)

      const nestedLines = []
      if (matchedShape !== undefined) {
        const { name, shape } = matchedShape

        const addressLines = Array.isArray(shape.address)
          ? shape.address
          : [shape.address]

        nestedLines.push(
          ...[
            name,
            `@ ${shape.blockNumber}`,
            ...addressLines.map((address) => address.toString()),
            `hash: ${shape.hash}`,
          ],
        )
      }

      const shapeData = nestedLines.map((line, index) => {
        const isLastLine = index === nestedLines.length - 1
        const linePrefix = isLastLine ? '└─' : '├─'
        const prefixText = `${nestedLinePrefix} ${linePrefix} `

        return `${indent}${chalk.gray(prefixText)}${chalk.green(line)}`
      })

      const log = `${contract.address} ${name} [${templateColor}]`
      logs.push(`${indent}${chalk.gray(firstLinePrefix)} ${log}`)

      if (shapeData) {
        logs.push(...shapeData)
      }
    }
  }

  if (untemplatized.length > 0) {
    logs.push(chalk.redBright(chalk.bold('Untemplatized')))
    for (const [i, contract] of untemplatized.entries()) {
      const entryConfig = makeEntryColorConfig(
        colorConfig,
        contract.address,
        templateService.loadContractTemplateColor(
          contract.extendedTemplate?.template,
        ),
      )

      const prefix = i === untemplatized.length - 1 ? '└─' : '├─'
      const indent = ' '.repeat(2)
      const name = chalk.blue(
        entryConfig.name ?? entryConfig.displayName ?? contract.name,
      )
      const log = `${contract.address} ${name}`
      logs.push(`${indent}${chalk.gray(prefix)} ${log}`)
    }
  }

  if (logs.length > 0) {
    logger.info(formatAsciiBorder(logs, true))
  }
}
