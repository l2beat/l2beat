import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, option, optional, run, string } from 'cmd-ts'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols'

export interface BridgeTransfer {
  chain: string
  protocol: string
  txHash: string
  direction: 'deposit' | 'withdraw'
}

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

    const rpcs = chains.map((c) => ({
      chain: c.name,
      rpc: new RpcClient({
        url: env.string(`${c.name.toUpperCase()}_RPC_URL`),
        sourceName: c.name,
        http,
        logger,
        callsPerMinute: c.callsPerMinute,
        retryStrategy: 'RELIABLE',
      }),
    }))

    const protocols = args.protocols
      ? PROTOCOLS.filter((p) => args.protocols?.split(',').includes(p.name))
      : PROTOCOLS

    const decoders = protocols.map((p) => p.decoder)

    for (const r of rpcs) {
      // TODO: pass as params block number and range
      const logs = await r.rpc.getLogs(22845129 - 10, 22845129)
      for (const l of logs) {
        for (const decoder of decoders) {
          const decoded = decoder(r.chain, l)
          if (decoded) {
            console.log(decoded)
          }
        }
      }
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
