import dotenv from 'dotenv'

import { analyze } from './analyze'
import { discover } from './discover'

export async function run() {
  dotenv.config()
  const args = process.argv.slice(2)
  if (args[0] === 'discover') {
    await discover(args.slice(1))
  } else {
    await analyze(args)
  }
}
