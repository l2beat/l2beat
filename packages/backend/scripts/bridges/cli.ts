import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, number, option, optional, run, string } from 'cmd-ts'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols/protocols'
import { getTokenAmount, getTokenSymbol } from './utils/erc20'
import { logToViemLog } from './utils/viem'

const args = {
  start: option({
    type: optional(number),
    long: 'start',
    description:
      'Starting block. If not passed will use "latest - range". Currently there is no support for per-chain starting blocks, you can only see latest for multiple chains.',
  }),
  range: option({
    type: optional(number),
    long: 'range',
    description: 'Specify how many blocks to fetch. Defaults to 100.',
  }),
  chains: option({
    type: optional(string),
    long: 'chains',
    description:
      'Comma-separated list of chains, runs script only for them. If not provided will run for all chains with envs configured.',
  }),
  protocols: option({
    type: optional(string),
    long: 'protocols',
    description:
      'Comma-separated list of protocols, runs script only for them. If not provided will run for all protocols with decoders configured.',
  }),
}

const cmd = command({
  name: 'bridges:cli',
  args,
  handler: async (args) => {
    const http = new HttpClient()
    const logger = Logger.INFO
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
      const range = args.range ?? 100
      const start = args.start
        ? args.start
        : (await r.rpc.getLatestBlockNumber()) - range

      const logs = await r.rpc.getLogs(start, start + range)

      for (const l of logs) {
        for (const decoder of decoders) {
          const decoded = decoder(r.chain, logToViemLog(l))
          if (decoded) {
            const tokenSymbol = await getTokenSymbol(r.rpc, decoded, start)
            const amount = await getTokenAmount(r.rpc, decoded, start)

            logger.info(decoded.protocol, {
              source: decoded.origin,
              destination: decoded.destination,
              token: tokenSymbol,
              amount: amount,
              ...(decoded.type ? { type: decoded.type } : {}),
              ...(decoded.txHash ? { hash: decoded.txHash } : {}),
            })
          }
        }
      }
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
