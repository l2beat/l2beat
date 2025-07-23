import type { Logger } from '@l2beat/backend-tools'
import chalk from 'chalk'
import type { StructureConfig } from '../discovery/config/StructureConfig'

export function printSharedModuleInfo(
  logger: Logger,
  backrefConfigs: StructureConfig[],
) {
  if (backrefConfigs.length > 0) {
    logger.info(
      `\n    -----=====[ ${chalk.red('SHARED MODULE DETECTED!')} ]=====-----`,
    )
    logger.info('\nAny changes to it will affect the following projects:')
    for (const c of backrefConfigs) {
      logger.info(`    - ${chalk.green(c.name)}`)
    }
  }
}
