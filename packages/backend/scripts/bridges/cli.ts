import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { command, option, optional, run, string } from 'cmd-ts'
import { type Hex, decodeFunctionResult, parseAbi } from 'viem'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols'

export interface BridgeTransfer {
  protocol: string
  source: string
  destination: string
  token: string
  amount: string
  sender: string
  receiver: string
  txHash: string
  id?: string
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
      // TODO: pass as params block number and range
      const logs = await r.rpc.getLogs(22845129 - 10, 22845129)
      for (const l of logs) {
        for (const decoder of decoders) {
          const decoded = decoder(r.chain, l)

          if (decoded) {
            const token = await r.rpc.call(
              {
                to: EthereumAddress(decoded?.token),
                data: Bytes.fromHex('0x95d89b41'),
              },
              22845129,
            )

            logger.debug(decoded)
            logger.info(decoded.protocol, {
              source: decoded.source,
              destination: decoded.destination,
              token: decodeFunctionResult({
                abi: ERC20,
                functionName: 'symbol',
                data: token.toString() as unknown as Hex,
              }),
            })
          }
        }
      }
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

const ERC20 = parseAbi(['function symbol() view returns (string)'])
