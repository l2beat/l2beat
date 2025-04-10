import chalk from 'chalk'
import type { StructureConfig } from '../discovery/config/StructureConfig'

export function printSharedModuleInfo(backrefConfigs: StructureConfig[]) {
  if (backrefConfigs.length > 0) {
    console.log(
      `\n    -----=====[ ${chalk.red('SHARED MODULE DETECTED!')} ]=====-----`,
    )
    console.log('\nAny changes to it will affect the following projects:')
    for (const c of backrefConfigs) {
      console.log(`    - ${chalk.green(c.name)}`)
    }
  }
}
