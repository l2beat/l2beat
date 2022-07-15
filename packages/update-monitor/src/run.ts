import dotenv from 'dotenv'

import { analyze } from './commands/analyze'
import { discover } from './commands/discover'
import { invert } from './commands/invert'
import { printUsage } from './commands/usage'

export async function run() {
  dotenv.config()
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    return
  }

  if (args[0] === 'discover') {
    await discover(args.slice(1))
    return
  }

  if (args[0] === 'invert') {
    await invert(args.slice(1))
    return
  }

  await analyze(args)
}
