import { run, subcommands } from 'cmd-ts'
import { getSubcommands } from './commands'

const targets = getSubcommands()
const main = subcommands({
  name: 'l2b',
  cmds: Object.fromEntries(targets.map((t) => [t.name, t])),
})

run(main, process.argv.slice(2))
