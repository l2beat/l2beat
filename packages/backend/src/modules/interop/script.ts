import { getEnv, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'

const ABI = parseAbi(['function localDomain() returns (uint32)'])

const WETH = EthereumAddress('0x81D40F21F12A8F0E3252Bccb954D722d4c464B64')

async function main() {
  const env = getEnv()

  const ps = new ProjectService()
  const chains = await ps.getProjects({
    select: ['chainConfig'],
    whereNot: ['archivedAt'],
  })

  const calldata = encodeFunctionData({
    abi: ABI,
    functionName: 'localDomain',
  })

  const chainPromises = chains
    .filter((chain) => chain.chainConfig.chainId !== undefined)
    .map(async (chain) => {
      const url =
        env.optionalString(`${chain.id.toUpperCase()}_RPC_URL`) ??
        chain.chainConfig.apis.find((a) => a.type === 'rpc')?.url

      if (url === undefined) {
        console.log('No RPC configuration for ', chain.id)
        return null
      }

      const rpc = new RpcClient({
        http: new HttpClient(),
        logger: Logger.INFO,
        retryStrategy: 'SCRIPT',
        url,
        sourceName: chain.id,
        callsPerMinute: 120,
      })

      try {
        const result = await rpc.call(
          {
            to: WETH,
            data: Bytes.fromHex(calldata),
          },
          'latest',
        )

        if (result.toString() === '0x') {
          console.log('No contract found on ', chain.id)
          return null
        }

        const decoded = decodeFunctionResult({
          data: result.toString() as Hex,
          abi: ABI,
          functionName: 'localDomain',
        })

        console.log(chain.id, decoded)
        return { chain: chain.id, domain: decoded }
      } catch (error) {
        console.error(`Error calling ${chain.id}:`, error)
        return null
      }
    })

  const results = await Promise.all(chainPromises)
  const cctpDomains = results.filter((result) => result !== null)

  console.log(
    [
      ...cctpDomains,
      { chain: 'solana', domain: 5 },
      { chain: 'sonic', domain: 13 },
      { chain: 'sei', domain: 16 },
      { chain: 'xdc', domain: 18 },
      { chain: 'hyperevm', domain: 19 },
    ].sort((a, b) => a.domain - b.domain),
  )
}

main().catch((e: unknown) => {
  console.error(e)
})
