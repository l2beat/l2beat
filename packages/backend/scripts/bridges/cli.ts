import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { command, number, option, optional, run, string } from 'cmd-ts'
import groupBy from 'lodash/groupBy'
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
    const matching: Record<
      string,
      Record<string, { send: Send[]; receive: Receive[] }>
    > = {}

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
          protocol[transfer.matchingId] = { send: [], receive: [] }
        }
        switch (transfer.direction) {
          case 'send':
            protocol[transfer.matchingId].send.push(transfer)
            break
          case 'receive':
            protocol[transfer.matchingId].receive.push(transfer)
            break
        }
      } else {
        if (!protocol['undefined']) {
          protocol['undefined'] = { send: [], receive: [] }
        }
        switch (transfer.direction) {
          case 'send':
            protocol['undefined'].send.push(transfer)
            break
          case 'receive':
            protocol['undefined'].receive.push(transfer)
            break
        }
      }
    }

    for (const [protocol, m] of Array.from(Object.entries(matching))) {
      for (const [id, mm] of Array.from(Object.entries(m))) {
        if (mm.send.length === 0 || mm.receive.length === 0) continue

        logger.info(`${protocol} ID: ${id}`)

        for (const t of [...mm.send, ...mm.receive]) {
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
      const send = transfers.filter(
        (t) => t.protocol === protocol && t.direction === 'send',
      )

      const receive = transfers.filter(
        (t) => t.protocol === protocol && t.direction === 'receive',
      )
      const matchedBreakdown: Record<string, number> = {}
      Object.entries(m).forEach(([id, match]) => {
        if (
          id === 'undefined' ||
          match.send.length === 0 ||
          match.receive.length === 0
        )
          return

        match.send.forEach((sendTx) => {
          match.receive.forEach((receiveTx) => {
            const senderChain = sendTx.token.split(':')[0]
            const receiverChain = receiveTx.token.split(':')[0]
            const pairKey = `${senderChain} -> ${receiverChain}`

            matchedBreakdown[pairKey] = (matchedBreakdown[pairKey] || 0) + 1
          })
        })
      })

      const unmatchedBreakdown: Record<string, number> = {}

      Object.entries(m).forEach(([id, match]) => {
        if (id === 'undefined') return
        if (match.send.length > 0 && match.receive.length === 0) {
          match.send.forEach((sendTx) => {
            const senderChain = sendTx.token.split(':')[0]
            const pairKey = `${senderChain} -> X`
            unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
          })
        }
      })

      Object.entries(m).forEach(([id, match]) => {
        if (id === 'undefined') return
        if (match.send.length === 0 && match.receive.length > 0) {
          match.receive.forEach((receiveTx) => {
            const receiverChain = receiveTx.token.split(':')[0]
            const pairKey = `X -> ${receiverChain}`
            unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
          })
        }
      })

      if (m['undefined']) {
        m['undefined'].send.forEach((sendTx) => {
          const senderChain = sendTx.token.split(':')[0]
          const pairKey = `${senderChain} -> X`
          unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
        })

        m['undefined'].receive.forEach((receiveTx) => {
          const receiverChain = receiveTx.token.split(':')[0]
          const pairKey = `X -> ${receiverChain}`
          unmatchedBreakdown[pairKey] = (unmatchedBreakdown[pairKey] || 0) + 1
        })
      }

      logger.info(protocol, {
        send: {
          count: send.length,
          breakdown: Object.entries(
            groupBy(send, (s) => s.token.split(':')[0]),
          ).reduce(
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
            groupBy(receive, (s) => s.token.split(':')[0]),
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
