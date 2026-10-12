import { run, subcommands } from 'cmd-ts'
import { config as dotenv } from 'dotenv'
import { getSubcommands } from './commands'

dotenv()

const targets = getSubcommands()
const main = subcommands({
  name: 'l2b',
  cmds: Object.fromEntries(targets.map((t) => [t.name, t])),
})

run(main, process.argv.slice(2))
