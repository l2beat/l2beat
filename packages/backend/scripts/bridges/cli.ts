import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, number, option, optional, run, string } from 'cmd-ts'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols/protocols'
import type { Receive } from './types/Receive'
import type { Send } from './types/Send'
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
    description:
      'Specify how many blocks to fetch (starting from starting block). Defaults to 100.',
  }),
  chains: option({
    type: optional(string),
    long: 'chains',
    description:
      'Comma-separated list of chains, runs script only for them. If not provided will run for all chains. See chains.ts for possible values.',
  }),
  protocols: option({
    type: optional(string),
    long: 'protocols',
    description:
      'Comma-separated list of protocols, runs script only for them. If not provided will run for all protocols with decoders configured. See protocols.ts for possible values.',
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
      ...c,
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

    const transfers: (Send | Receive)[] = []
    const matching: Record<string, Record<string, (Send | Receive)[]>> = {}

    for (const r of rpcs) {
      const range = args.range ?? 100
      const start = args.start
        ? args.start
        : (await r.rpc.getLatestBlockNumber()) - range

      logger.info(`Fetching logs from ${r.name} <${start},${start + range}>`)

      const logs = await r.rpc.getLogs(start, start + range)

      for (const l of logs) {
        for (const decoder of decoders) {
          const decoded = decoder(r, logToViemLog(l))
          if (decoded) {
            transfers.push(decoded)
          }
        }
      }
    }

    for (const transfer of transfers) {
      if (!matching[transfer.protocol]) {
        matching[transfer.protocol] = {}
      }
      const protocol = matching[transfer.protocol]

      if (transfer.matchingId) {
        if (!protocol[transfer.matchingId]) {
          protocol[transfer.matchingId] = []
        }
        protocol[transfer.matchingId].push(transfer)
      } else {
        if (!protocol['undefined']) {
          protocol['undefined'] = []
        }
        protocol['undefined'].push(transfer)
      }
    }

    for (const [protocol, m] of Array.from(Object.entries(matching))) {
      for (const [id, mm] of Array.from(Object.entries(m))) {
        if (mm.length < 2) continue

        logger.info(`${protocol} ID: ${id}`)

        for (const t of mm) {
          const getTxUrl = CHAINS.find(
            (c) => c.shortName === t.token.split(':')[0],
          )?.getTxUrl
          logger.info(t.direction, {
            token: t.token,
            amount: t.amount,
            ...(t.txHash ? { tx: t.txHash } : {}),
            ...(t.txHash && getTxUrl ? { explorer: getTxUrl(t.txHash) } : {}),
          })
        }
      }
    }

    for (const [protocol, m] of Array.from(Object.entries(matching))) {
      logger.info(protocol, {
        send: transfers.filter(
          (t) => t.protocol === protocol && t.direction === 'send',
        ).length,
        receive: transfers.filter(
          (t) => t.protocol === protocol && t.direction === 'receive',
        ).length,
        matched: Object.entries(m).filter(([_, m]) => m.length > 1).length,
        unmatched:
          Object.entries(m).filter(([_, m]) => m.length === 1).length +
          (m['undefined']?.length ?? 0),
      })
    }
    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
