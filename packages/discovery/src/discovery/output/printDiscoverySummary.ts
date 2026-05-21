import type { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import type { Analysis } from '../analysis/AddressAnalyzer'

export function printDiscoverySummary(
  logger: Logger,
  analyses: Analysis[],
  timedOut: ChainSpecificAddress[] = [],
): void {
  const total = analyses.length
  const contracts = analyses.filter((a) => a.type === 'Contract').length
  const eoas = analyses.filter((a) => a.type === 'EOA').length
  const templated = analyses.filter(
    (a) => a.type === 'Contract' && a.extendedTemplate !== undefined,
  ).length
  const untemplated = contracts - templated

  logger.info('')
  logger.info(chalk.bold('Discovery summary'))
  logger.info(
    `  ${chalk.cyan(total)} entries (${chalk.cyan(contracts)} contracts, ${chalk.cyan(eoas)} EOAs)`,
  )
  logger.info(
    `  ${chalk.green(templated)} templated, ${chalk.yellow(untemplated)} untemplated`,
  )

  if (timedOut.length > 0) {
    logger.warn(
      chalk.redBright(
        `  WARNING: ${timedOut.length} address(es) timed out during analysis (--analyze-timeout). They are missing from the discovery.`,
      ),
    )
    for (const address of timedOut.slice(0, 10)) {
      logger.warn(chalk.redBright(`    - ${address}`))
    }
    if (timedOut.length > 10) {
      logger.warn(chalk.redBright(`    ... and ${timedOut.length - 10} more`))
    }
  }
}
