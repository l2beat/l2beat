import { getEnv } from '@l2beat/backend-tools'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { createPublicClient, getContract, http, parseAbi } from 'viem'

const config = [
  {
    chain: 'base',
    registry: '0x6f6C373d09C07425BaAE72317863d7F6bb731e37' as `0x${string}`,
  },
  {
    chain: 'arbitrum',
    registry: '0x39AE1032cF4B334a1Ed41cdD0833bdD7c7E7751E' as `0x${string}`,
  },
  {
    chain: 'ethereum',
    registry: '0xb22764f98dD05c789929716D677382Df22C05Cb6' as `0x${string}`,
  },
  {
    chain: 'optimism',
    registry: '0x657c42abE4CD8aa731Aec322f871B5b90cf6274F' as `0x${string}`,
  },
]

const abi = parseAbi([
  'function getAllConfiguredTokens(uint64 startIndex, uint64 maxCount) view returns (address[])',
  'function getPool(address token) view returns (address)',
  'function typeAndVersion() view returns (string)',
  'function symbol() view returns (string)',
])

const output = {
  poolTypes: [] as unknown[],
  tokens: [] as unknown[],
}

main()

async function main() {
  const env = getEnv()

  const poolTypes = new Map<string, number>()

  for (const chainConfig of config) {
    const client = createPublicClient({
      transport: http(env.string(`${chainConfig.chain.toUpperCase()}_RPC_URL`)),
    })
    const contract = getContract({
      client,
      address: chainConfig.registry,
      abi,
    })
    const result = [
      ...(await contract.read.getAllConfiguredTokens([0n, 10_000n])),
    ]
    await promiseBatch(50, result, async (token) => {
      const tokenContract = getContract({ client, abi, address: token })
      const symbol = await tokenContract.read.symbol().catch(() => 'REVERTED')
      const pool = await contract.read.getPool([token])
      const poolContract = getContract({ client, abi, address: pool })
      const typeAndVersion = await poolContract.read
        .typeAndVersion()
        .catch(() => 'REVERTED')
      const tokenInfo = {
        chain: chainConfig.chain,
        token,
        pool,
        symbol,
        typeAndVersion,
      }
      console.log(tokenInfo)
      if (typeAndVersion !== 'REVERTED') {
        const count = poolTypes.get(typeAndVersion) ?? 0
        poolTypes.set(typeAndVersion, count + 1)
      }
      output.tokens.push(tokenInfo)
    })
  }

  output.poolTypes = Array.from(poolTypes.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
  writeFileSync(
    join(__dirname, 'ccip.tokens.json'),
    JSON.stringify(output, null, 2),
  )
}

async function promiseBatch<T, U>(
  size: number,
  array: T[],
  cb: (value: T) => Promise<U>,
): Promise<U[]> {
  const results: U[] = []
  for (let i = 0; i < array.length; i += size) {
    const batch = array.slice(i, i + size)
    results.push(...(await Promise.all(batch.map(cb))))
  }
  return results
}
