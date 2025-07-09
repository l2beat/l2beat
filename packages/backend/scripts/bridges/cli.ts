import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, number, option, optional, run, string } from 'cmd-ts'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols/protocols'
import type { BridgeTransfer } from './types/BridgeTransfer'
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

    const transfersByProtocolAndId: Record<string, BridgeTransfer[]> = {}

    for (const r of rpcs) {
      const range = args.range ?? 100
      const start = args.start
        ? args.start
        : (await r.rpc.getLatestBlockNumber()) - range

      logger.info(`Fetching logs for ${r.name}`, {
        from: start,
        to: start + range,
      })

      const logs = await r.rpc.getLogs(start, start + range)

      for (const l of logs) {
        for (const decoder of decoders) {
          const decoded = decoder(r.name, logToViemLog(l))
          if (decoded) {
            const tokenSymbol = await getTokenSymbol(r.rpc, decoded, start)
            const amount = await getTokenAmount(r.rpc, decoded, start)

            logger.info(
              `${decoded.protocol} on ${decoded.chain} (${decoded.type ?? ''})`,
              {
                origin: decoded.origin,
                destination: decoded.destination,
                token: tokenSymbol,
                amount: amount,
                ...(decoded.sender ? { sender: decoded.sender } : {}),
                ...(decoded.receiver ? { receiver: decoded.receiver } : {}),
                ...(decoded.txHash ? { txHash: decoded.txHash } : {}),
                ...(decoded.txHash
                  ? { explorerLink: r.getTxUrl(decoded.txHash) }
                  : {}),
                ...(decoded.matchingId ? { id: decoded.matchingId } : {}),
              },
            )

            if (decoded.matchingId) {
              const key = `${decoded.protocol}:${decoded.matchingId}`

              if (!transfersByProtocolAndId[key]) {
                transfersByProtocolAndId[key] = []
              }
              transfersByProtocolAndId[key].push(decoded)
            }
          }
        }
      }
    }

    const transfersCountByProtocol: Record<string, number> = {}

    for (const [key, transfers] of Object.entries(transfersByProtocolAndId)) {
      if (transfers.length > 1) {
        const [protocol, id] = key.split(':')
        logger.info(
          `Found ${transfers.length} related transfers for ${protocol} with ID ${id}:`,
        )

        transfers.forEach((transfer, index) => {
          const getTxUrl = CHAINS.find(
            (c) => c.name === transfer.chain,
          )?.getTxUrl

          logger.info(
            `  [${index + 1}] ${transfer.type} on ${transfer.chain}`,
            {
              origin: transfer.origin,
              destination: transfer.destination,
              token: transfer.token,
              amount: transfer.amount,
              ...(transfer.sender ? { sender: transfer.sender } : {}),
              ...(transfer.receiver ? { receiver: transfer.receiver } : {}),
              ...(transfer.txHash ? { txHash: transfer.txHash } : {}),
              ...(transfer.txHash && getTxUrl
                ? { explorerLink: getTxUrl(transfer.txHash) }
                : {}),
            },
          )
        })

        if (!transfersCountByProtocol[protocol]) {
          transfersCountByProtocol[protocol] = 0
        }
        transfersCountByProtocol[protocol]++
      }
    }

    logger.info(`Matching summary`, { protocols: transfersCountByProtocol })

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
