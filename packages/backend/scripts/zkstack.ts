import { tokenList } from '@l2beat/config'
import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import {
  http,
  Address,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import { mainnet } from 'viem/chains'

const CHAINS = [
  {
    name: 'ZKsync Era',
    chainId: 324,
    etherAddress: '0x000000000000000000000000000000000000800A',
    rpcUrl: 'https://mainnet.era.zksync.io',
  },
  {
    name: 'Cronos',
    chainId: 388,
    etherAddress: '0x898b3560affd6d955b1574d87ee09e46669c60ea',
    rpcUrl: 'https://mainnet.zkevm.cronos.org',
  },
] as const

interface Token {
  address: EthereumAddress
  symbol: string
  decimals: number
}

async function main() {
  const url = process.env.ETHEREUM_RPC_URL

  const ethereumClient = createPublicClient({
    chain: mainnet,
    transport: http(url),
  })

  const bridge = '0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB' as Address

  const bridgeAbi = parseAbi([
    'function chainBalance(uint256 chainId, address l1Token) view returns (uint256)',
  ])

  const multicallAbi = parseAbi([
    'function aggregate((address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
  ])

  const multicallAddress =
    '0xcA11bde05977b3631167028862bE2a173976CA11' as Address

  const tokensOnEthereum = tokenList.filter(
    (token): token is typeof token & { address: EthereumAddress } =>
      token.chainId === ChainId.ETHEREUM && token.address !== undefined,
  )

  const batchSize = 100

  const erc20Abi = parseAbi(['function totalSupply() view returns (uint256)'])

  for (const chain of CHAINS) {
    console.log(`Processing ${chain.name} (Chain ID: ${chain.chainId})`)

    const chainClient = createPublicClient({
      transport: http(chain.rpcUrl),
    })

    try {
      const totalSupply = await chainClient.readContract({
        address: chain.etherAddress as Address,
        abi: erc20Abi,
        functionName: 'totalSupply',
      })

      console.log(`ETH: ${formatEther(totalSupply)} ETH`)
    } catch (error) {
      console.error(
        `Error fetching Ether total supply for ${chain.name}:`,
        error,
      )
    }

    await processBatches(
      ethereumClient,
      tokensOnEthereum,
      chain,
      bridge,
      bridgeAbi,
      multicallAddress,
      multicallAbi,
      batchSize,
    )

    console.log('---')
  }
}

async function processBatches(
  client: PublicClient,
  tokens: Token[],
  chain: (typeof CHAINS)[number],
  bridge: Address,
  bridgeAbi: ReturnType<typeof parseAbi>,
  multicallAddress: Address,
  multicallAbi: ReturnType<typeof parseAbi>,
  batchSize: number,
) {
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)

    const calls = batch.map((token) => ({
      target: bridge,
      callData: encodeFunctionData({
        abi: bridgeAbi,
        functionName: 'chainBalance',
        args: [BigInt(chain.chainId), token.address.toString() as Address],
      }),
    }))

    try {
      const [, returnData] = (await client.readContract({
        address: multicallAddress,
        abi: multicallAbi,
        functionName: 'aggregate',
        args: [calls],
      })) as [bigint, readonly string[]]

      returnData.forEach((data, index) => {
        const balance = BigInt(data as string)
        if (balance > 0n) {
          const token = batch[index]
          console.log(
            `${token.symbol}: ${formatUnits(balance, token.decimals)} ${
              token.symbol
            }`,
          )
        }
      })
    } catch (error) {
      console.error(`Error fetching balances for batch:`, error)
    }
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('An error occurred:', error)
    process.exit(1)
  })
