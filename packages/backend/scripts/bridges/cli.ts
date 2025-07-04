import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, option, optional, run, string } from 'cmd-ts'
import { CHAINS } from './chains'

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
  handler: async (args) => {
    const http = new HttpClient()
    const logger = Logger.SILENT
    const env = getEnv()

    const chains = args.chains
      ? CHAINS.filter((c) => args.chains?.split(',').includes(c.name))
      : CHAINS

    const rpcs = chains.map(
      (c) =>
        new RpcClient({
          url: env.string(`${c.name.toUpperCase()}_RPC_URL`),
          sourceName: c.name,
          http,
          logger,
          callsPerMinute: c.callsPerMinute,
          retryStrategy: 'RELIABLE',
        }),
    )

    for (const r of rpcs) {
      const latest = await r.getLatestBlockNumber()
      const logs = await r.getLogs(latest - 10, latest)
      console.log(logs.map((l) => l.transactionHash))
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

// function decode(tx: Transaction) {}
