import { getEnv, Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, number, option, optional, run, string } from 'cmd-ts'
import groupBy from 'lodash/groupBy'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols/protocols'
import type { Message } from './types/Message'
import { EnvioClient } from './utils/EnvioClient'

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
    const envioApiToken = env.string('ENVIO_API_TOKEN')

    const enabledChains = args.chains
      ? CHAINS.filter((c) => args.chains?.split(',').includes(c.name))
      : CHAINS

    const chains = enabledChains.map((c) => ({
      ...c,
      rpc: new RpcClient({
        url: env.string(`${c.name.toUpperCase()}_RPC_URL`),
        sourceName: c.name,
        http,
        logger,
        callsPerMinute: c.callsPerMinute,
        retryStrategy: 'SCRIPT',
      }),
      envioClient: new EnvioClient({
        url: c.envio,
        apiToken: envioApiToken,
        sourceName: c.name,
        http,
        logger,
        callsPerMinute: c.callsPerMinute,
        retryStrategy: 'SCRIPT',
      }),
      start: args.start ?? -1, // will be filled later
      range: args.range ?? 1_000,
    }))

    const enabledProtocols = args.protocols
      ? PROTOCOLS.filter((p) => args.protocols?.split(',').includes(p.name))
      : PROTOCOLS

    const decoders = enabledProtocols.map((p) => p.decoder)

    logger.info('Running script', {
      protocols: enabledProtocols.map((p) => p.name),
      chains: enabledChains.map((c) => c.name),
    })

    const blockPromises: (() => Promise<void>)[] = []
    for (const r of chains) {
      if (r.start === -1) {
        blockPromises.push(async () => {
          const latest = await r.rpc.getLatestBlockNumber()
          r.start = latest - r.range
        })
      }
    }

    const messages: Message[] = []
    logger.info('Fetching block numbers...')
    await Promise.all(blockPromises.map((fn) => fn()))

    const BATCH_SIZE = 100
    const promises: (() => Promise<void>)[] = []
    for (const r of chains) {
      const totalRange = r.range
      const numBatches = Math.ceil(totalRange / BATCH_SIZE)

      for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
        promises.push(async () => {
          const batchStart = r.start + batchIndex * BATCH_SIZE
          const batchEnd = Math.min(batchStart + BATCH_SIZE, r.start + r.range)

          const transactions = await r.envioClient.getTransactionsWithLogs(
            batchStart,
            batchEnd,
          )

          for (const t of transactions) {
            for (const decoder of decoders) {
              const d = decoder(r, t)
              if (d) {
                messages.push(d)
              }
            }
          }
        })
      }
    }

    logger.info('Fetching data... (this may take a while)')
    await Promise.all(promises.map((fn) => fn()))

    const matching: Record<
      string,
      Record<string, { send: Message[]; receive: Message[] }>
    > = {}
    for (const transfer of messages) {
      if (!matching[transfer.protocol]) {
        matching[transfer.protocol] = {}
      }
      const protocol = matching[transfer.protocol]

      if (transfer.matchingId) {
        if (!protocol[transfer.matchingId]) {
          protocol[transfer.matchingId] = { send: [], receive: [] }
        }
        switch (transfer.direction) {
          case 'outbound':
            protocol[transfer.matchingId].send.push(transfer)
            break
          case 'inbound':
            protocol[transfer.matchingId].receive.push(transfer)
            break
        }
      } else {
        if (!protocol['undefined']) {
          protocol['undefined'] = { send: [], receive: [] }
        }
        switch (transfer.direction) {
          case 'outbound':
            protocol['undefined'].send.push(transfer)
            break
          case 'inbound':
            protocol['undefined'].receive.push(transfer)
            break
        }
      }
    }

    for (const t of messages) {
      logger.info(`${t.direction} via ${t.protocol}`, {
        ...t,
      })
    }

    for (const [protocol, m] of Array.from(Object.entries(matching))) {
      const send = messages.filter(
        (t) => t.protocol === protocol && t.direction === 'outbound',
      )

      const receive = messages.filter(
        (t) => t.protocol === protocol && t.direction === 'inbound',
      )
      const matchedBreakdown: Record<string, number> = {}
      Object.entries(m).forEach(([id, match]) => {
        if (
          id === 'undefined' ||
          match.send.length === 0 ||
          match.receive.length === 0
        )
          return

        match.send.forEach((_) => {
          match.receive.forEach((receiveTx) => {
            const pairKey = `${receiveTx.origin} -> ${receiveTx.destination}`

            matchedBreakdown[pairKey] = (matchedBreakdown[pairKey] || 0) + 1
          })
        })
      })

      const unmatchedBreakdown: Record<string, number> = {}

      Object.entries(m).forEach(([id, match]) => {
        if (id === 'undefined') return
        if (match.send.length > 0 && match.receive.length === 0) {
          match.send.forEach((sendTx) => {
            const pairKey = `${sendTx.origin} -> X`
            unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
          })
        }
      })

      Object.entries(m).forEach(([id, match]) => {
        if (id === 'undefined') return
        if (match.send.length === 0 && match.receive.length > 0) {
          match.receive.forEach((receiveTx) => {
            const pairKey = `X -> ${receiveTx.destination}`
            unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
          })
        }
      })

      if (m['undefined']) {
        m['undefined'].send.forEach((sendTx) => {
          const pairKey = `${sendTx.origin} -> X`
          unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
        })

        m['undefined'].receive.forEach((receiveTx) => {
          const pairKey = `X -> ${receiveTx.destination}`
          unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
        })
      }

      logger.info(protocol, {
        send: {
          count: send.length,
          breakdown: Object.entries(groupBy(send, (s) => s.origin)).reduce(
            (acc, [chain, items]) => {
              acc[chain] = items.length
              return acc
            },
            {} as Record<string, number>,
          ),
        },
        receive: {
          count: receive.length,
          breakdown: Object.entries(
            groupBy(receive, (s) => s.destination),
          ).reduce(
            (acc, [chain, items]) => {
              acc[chain] = items.length
              return acc
            },
            {} as Record<string, number>,
          ),
        },
        matched: {
          count: Object.entries(m).filter(
            ([_, m]) => m.send.length > 0 && m.receive.length > 0,
          ).length,
          breakdown: matchedBreakdown,
        },
        unmatched: {
          count:
            Object.entries(m).filter(
              ([_, m]) => m.send.length === 0 || m.receive.length === 0,
            ).length +
            (m['undefined']?.send.length ?? 0) +
            (m['undefined']?.receive.length ?? 0),
          breakdown: unmatchedBreakdown,
        },
      })
    }
    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
