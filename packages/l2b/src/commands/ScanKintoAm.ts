import chalk from 'chalk'
import { command } from 'cmd-ts'
import { runScanKintoAm } from '../implementations/scan-kinto-am/ScanKintoAmImpl'

export const ScanKintoAm = command({
  name: 'scankintoam',
  description:
    'Scan the Kinto Access Manager contract for roles, targets, and pending operations.',
  args: {},
  handler: async () => {
    console.log(chalk.blueBright('\nStarting ScanKintoAm...\n'))
    await runScanKintoAm()
  },
})
