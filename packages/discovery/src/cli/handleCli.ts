import { getCliParameters } from './getCliParameters'
import { exitWithUsage, printUsage } from './usage'

export function handleCli() {
  const cli = getCliParameters()
  if (cli.mode === 'help') {
    if (cli.error) {
      exitWithUsage(cli.error)
    } else {
      printUsage()
    }
  }

  return cli
}
