import { getEnv, Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, formatSeconds } from '@l2beat/shared-pure'
import { command, number, positional, run, string } from 'cmd-ts'
import { CHAINS, type Chain } from './chains'
import { PROTOCOLS } from './protocols/protocols'
import { runDecoders } from './runDecoders'
import type { Message } from './types/Message'

const args = {
  protocol: positional({
    type: string,
    displayName: 'protocol',
  }),
  chain1: positional({
    type: string,
    displayName: 'chain1',
  }),
  block1: positional({
    type: number,
    displayName: 'block1',
  }),
  chain2: positional({
    type: string,
    displayName: 'chain2',
  }),
  block2: positional({
    type: number,
    displayName: 'block2',
  }),
}

const cmd = command({
  name: 'bridges:cli',
  args,
  handler: async (args) => {
    const logger = Logger.INFO
    const chains = setupChains(args, logger)
    const protocol = PROTOCOLS.find((p) => p.name === args.protocol)
    assert(protocol, `${args.protocol}: Protocol not found`)

    const messages: Message[] = await runDecoders(chains, logger, protocol)

    for (const message of messages) {
      logger.info(`${message.direction} (${message.type})`, message)
    }

    const outbound = messages.find((m) => m.direction === 'outbound')
    assert(outbound, 'Outbound message not found, update decoder')
    const inbound = messages.find(
      (m) => m.direction === 'inbound' && m.matchingId === outbound?.matchingId,
    )
    assert(inbound, 'Inbound message not found, update decoder')

    logger.info('Matching', {
      latency: formatSeconds(inbound.blockTimestamp - outbound.blockTimestamp),
      origin: chains
        .find((c) => c.shortName === outbound.origin)
        ?.getTxUrl(outbound.txHash),
      destination: chains
        .find((c) => c.shortName === inbound.destination)
        ?.getTxUrl(inbound.txHash),
      id: outbound.matchingId,
    })
  },
})

function setupChains(
  args: {
    protocol: string
    chain1: string
    block1: number
    chain2: string
    block2: number
  },
  logger: Logger,
) {
  const http = new HttpClient()
  const env = getEnv()

  const chain1 = CHAINS.find((c) => c.name === args.chain1)
  assert(chain1, `${args.chain1}: Chain not found`)

  const chain2 = CHAINS.find((c) => c.name === args.chain2)
  assert(chain2, `${args.chain2}: Chain not found`)

  const chains = (
    [
      [chain1, args.block1],
      [chain2, args.block2],
    ] as [Chain, number][]
  ).map(([chain, block]) => ({
    ...chain,
    block,
    rpc: new RpcClient({
      url: env.string(`${chain.name.toUpperCase()}_RPC_URL`),
      sourceName: chain.name,
      http,
      logger,
      callsPerMinute: chain.rpcCallsPerMinute,
      retryStrategy: 'SCRIPT',
    }),
  }))
  return chains
}

run(cmd, process.argv.slice(2))
