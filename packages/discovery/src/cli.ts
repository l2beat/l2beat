import { SingleDiscoveryCommand } from './cli/singleDiscoveryCommand'

import { run, subcommands } from 'cmd-ts'
import { DiscoverCommand } from './cli/discoverCommand'

const targets = [SingleDiscoveryCommand, DiscoverCommand]

const main = subcommands({
  name: 'discovery',
  cmds: Object.fromEntries(targets.map((t) => [t.name, t])),
})

run(main, process.argv.slice(2))
