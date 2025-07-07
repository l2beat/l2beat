import { Logger, getEnv } from '@l2beat/backend-tools'
import { type EVMLog, HttpClient, RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { command, number, option, optional, run, string } from 'cmd-ts'
import {
  type Hex,
  type Log,
  decodeFunctionResult,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import { CHAINS } from './chains'
import { PROTOCOLS } from './protocols/protocols'

const args = {
  start: option({
    type: optional(number),
    long: 'start',
    short: 's',
    description:
      'Starting block. If not passed will use "latest - range". Currently there is no support for per-chain starting blocks, you can only see latest for multiple chains.',
  }),
  range: option({
    type: optional(number),
    long: 'range',
    short: 'r',
    description: 'Specify how many blocks to fetch. Defaults to 100.',
  }),
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
      const range = args.range ?? 100
      const start = args.start
        ? args.start
        : (await r.rpc.getLatestBlockNumber()) - range

      const logs = await r.rpc.getLogs(start, start + range)

      for (const l of logs) {
        for (const decoder of decoders) {
          const decoded = decoder(r.chain, logToViemLog(l))
          if (decoded) {
            const symbol = await r.rpc.call(
              {
                to: EthereumAddress(decoded?.token),
                data: Bytes.fromHex(
                  encodeFunctionData({ abi: ERC20, functionName: 'symbol' }),
                ),
              },
              start,
            )

            const decimals = await r.rpc.call(
              {
                to: EthereumAddress(decoded?.token),
                data: Bytes.fromHex(
                  encodeFunctionData({ abi: ERC20, functionName: 'decimals' }),
                ),
              },
              start,
            )

            const dec = decodeFunctionResult({
              abi: ERC20,
              functionName: 'decimals',
              data: decimals.toString() as unknown as Hex,
            })

            const decimalShift = BigInt(dec) - 4n
            const divisor = decimalShift > 0n ? 10n ** decimalShift : 1n
            const amount = Number(BigInt(decoded.amount) / divisor) / 10000

            logger.debug(decoded)
            logger.info(decoded.protocol, {
              source: decoded.source,
              destination: decoded.destination,
              token: decodeFunctionResult({
                abi: ERC20,
                functionName: 'symbol',
                data: symbol.toString() as unknown as Hex,
              }),
              amount: amount,
              hash: decoded.txHash,
            })
          }
        }
      }
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

const ERC20 = parseAbi([
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
])

function logToViemLog(log: EVMLog): Log {
  return {
    blockNumber: BigInt(log.blockNumber),
    transactionHash: log.transactionHash as Hex,
    address: log.address as Hex,
    topics: log.topics as [Hex, ...Hex[]] | [],
    data: log.data as Hex,

    // Unsupported values for now
    blockHash: 'UNSUPPORTED' as Hex,
    logIndex: -1,
    transactionIndex: -1,
    removed: false,
  }
}
