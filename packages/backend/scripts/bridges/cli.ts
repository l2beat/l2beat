import { command, option, optional, run, string } from 'cmd-ts'

const args = {
  chains: option({
    type: optional(string),
    long: 'chains',
    short: 'c',
    description:
      'Comma-separated list of chains, runs script only for them. If not provided will run for all chains with envs configured.',
  }),
  protocols: option({
    type: optional(string),
    long: 'protocols',
    short: 'p',
    description:
      'Comma-separated list of protocols, runs script only for them. If not provided will run for all protocols with decoders configured.',
  }),
}

const cmd = command({
  name: 'bridges:cli',
  args,
  handler: (args) => {
    console.log(args.chains?.split(','))
    console.log(args.protocols?.split(','))

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
