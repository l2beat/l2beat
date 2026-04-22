import { run, subcommands } from 'cmd-ts'
import { getSubcommands } from './commands'
import { loadDiscoveryEnv } from './implementations/loadDiscoveryEnv'

// Loads `packages/config/.env` (or the equivalent) regardless of cwd, so
// commands like `discover` and `add-shape` work from any directory inside
// the repo.
loadDiscoveryEnv()

const targets = getSubcommands()
const main = subcommands({
  name: 'l2b',
  cmds: Object.fromEntries(targets.map((t) => [t.name, t])),
})

run(main, process.argv.slice(2))
