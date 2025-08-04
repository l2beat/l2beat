import { getEnv, Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, formatSeconds } from '@l2beat/shared-pure'
import { command, number, positional, run, string } from 'cmd-ts'
import { CHAINS, type Chain } from './chains'
import { Decoder } from './Decoder'
import { PROTOCOLS } from './protocols/protocols'

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
    const decoder = new Decoder(PROTOCOLS, chains, logger)

    const { messages, assets } = await decoder.execute(args.protocol, [
      {
        chain: args.chain1,
        block: args.block1,
      },
      {
        chain: args.chain2,
        block: args.block2,
      },
    ])

    for (const outboundMessage of messages.filter(
      (m) => m.direction === 'outbound',
    )) {
      const inboundMessage = messages.find(
        (m) =>
          m.direction === 'inbound' &&
          m.matchingId === outboundMessage.matchingId,
      )
      if (!inboundMessage) {
        continue
      }

      logger.info('Message matching', {
        protocol: inboundMessage.protocol,
        latency: formatSeconds(
          inboundMessage.blockTimestamp - outboundMessage.blockTimestamp,
        ),
        origin: chains
          .find((c) => c.shortName === outboundMessage.origin)
          ?.getTxUrl(outboundMessage.txHash),
        destination: chains
          .find((c) => c.shortName === inboundMessage.destination)
          ?.getTxUrl(inboundMessage.txHash),
        id: outboundMessage.matchingId,
      })
    }

    for (const outboundAsset of assets.filter(
      (m) => m.direction === 'outbound',
    )) {
      const inboundAsset = assets.find(
        (m) =>
          m.direction === 'inbound' &&
          m.matchingId === outboundAsset.matchingId,
      )
      if (!inboundAsset) {
        continue
      }

      logger.info('Asset matching', {
        application: inboundAsset.application,
        inputAmount: Number(inboundAsset.amount),
        outputAmount: Number(outboundAsset.amount),
        latency: formatSeconds(
          inboundAsset.blockTimestamp - outboundAsset.blockTimestamp,
        ),
        originTx: chains
          .find((c) => c.shortName === outboundAsset.origin)
          ?.getTxUrl(outboundAsset.txHash),
        destinationTx: chains
          .find((c) => c.shortName === inboundAsset.destination)
          ?.getTxUrl(inboundAsset.txHash),
        inputToken: chains
          .find((c) => c.shortName === outboundAsset.origin)
          ?.getAddressUrl(outboundAsset.token),
        outputToken: chains
          .find((c) => c.shortName === inboundAsset.destination)
          ?.getAddressUrl(inboundAsset.token),
        id: outboundAsset.matchingId,
      })
    }
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
