import { run, subcommands } from 'cmd-ts'
import { DiscoverCommand } from './cli/discoverCommand.js'
import { GenerateSchemasCommand } from './cli/generateSchemas.js'
import { SingleDiscoveryCommand } from './cli/singleDiscoveryCommand.js'

const targets = [
  SingleDiscoveryCommand,
  DiscoverCommand,
  GenerateSchemasCommand,
]

const main = subcommands({
  name: 'discovery',
  cmds: Object.fromEntries(targets.map((t) => [t.name, t])),
})

run(main, process.argv.slice(2))
