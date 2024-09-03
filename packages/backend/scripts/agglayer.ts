import { tokenList } from '@l2beat/config/src'
import { ChainId, EthereumAddress, notUndefined } from '@l2beat/shared-pure'
import { formatUnits } from 'ethers/lib/utils'
import {
  http,
  Address,
  PublicClient,
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
  formatEther,
  parseAbi,
} from 'viem'

const CHAINS = [
  {
    name: 'Polygon zkEVM',
    rpcUrl: 'https://polygon-zkevm.drpc.org',
    premintedEth: 200000000000000000000000000n,
  },
  {
    name: 'X Layer',
    rpcUrl: 'https://rpc.xlayer.tech',
    premintedEth: 0n,
  },
  {
    name: 'Astar zkEVM',
    rpcUrl: 'https://rpc.startale.com/astar-zkevm',
    premintedEth: 340282366920938463463374607431768211455n,
  },
] as const

interface Token {
  address: EthereumAddress
  symbol: string
  decimals: number
}

// same address on all the chains
const bridge = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe' as Address

const bridgeAbi = parseAbi([
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])

const batchSize = 100

const erc20Abi = parseAbi(['function totalSupply() view returns (uint256)'])

const multicallAbi = parseAbi([
  'function aggregate((address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
])

const multicallAddress = '0xcA11bde05977b3631167028862bE2a173976CA11' as Address

async function main() {
  const tokensOnEthereum = tokenList.filter(
    (token): token is typeof token & { address: EthereumAddress } =>
      token.chainId === ChainId.ETHEREUM && token.address !== undefined,
  )

  for (const chain of CHAINS) {
    console.log(`Processing ${chain.name}`)

    const chainClient = createPublicClient({
      transport: http(chain.rpcUrl),
    })

    const etherSupply = await chainClient.getBalance({
      address: bridge as Address,
    })

    console.log(`ETH: ${formatEther(chain.premintedEth - etherSupply)} ETH`)

    const supportsMulticall = await checkMulticallSupport(chainClient)

    await processBatches(
      chainClient,
      tokensOnEthereum,
      chain,
      supportsMulticall,
    )

    console.log('---')
  }
}

async function checkMulticallSupport(
  chainClient: PublicClient,
): Promise<boolean> {
  try {
    await chainClient.readContract({
      address: multicallAddress,
      abi: multicallAbi,
      functionName: 'aggregate',
      args: [[]],
    })
    return true
  } catch {
    return false
  }
}

async function processBatches(
  chainClient: PublicClient,
  tokens: Token[],
  chain: (typeof CHAINS)[number],
  supportsMulticall: boolean,
) {
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)

    if (supportsMulticall) {
      await processBatchWithMulticall(chainClient, batch)
    } else {
      await processBatchIndividually(chainClient, batch, chain)
    }
  }
}

async function processBatchWithMulticall(
  chainClient: PublicClient,
  batch: Token[],
) {
  const calls = batch.map((token) => ({
    target: bridge,
    callData: encodeFunctionData({
      abi: bridgeAbi,
      functionName: 'getTokenWrappedAddress',
      args: [0, token.address.toString() as Address],
    }),
  }))

  const [, returnData] = await chainClient.readContract({
    address: multicallAddress,
    abi: multicallAbi,
    functionName: 'aggregate',
    args: [calls],
  })

  const foundTokens = returnData
    .map((data, i) => {
      const token = batch[i]
      const l2TokenAddress = decodeFunctionResult({
        abi: bridgeAbi,
        functionName: 'getTokenWrappedAddress',
        data,
      })

      if (l2TokenAddress === '0x0000000000000000000000000000000000000000') {
        return
      }

      return {
        ...token,
        l2TokenAddress,
      }
    })
    .filter(notUndefined)

  const totalSupplyCalls = foundTokens.map((data) => {
    return {
      target: data.l2TokenAddress,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'totalSupply',
      }),
    }
  })

  const [, result] = await chainClient.readContract({
    address: multicallAddress,
    abi: multicallAbi,
    functionName: 'aggregate',
    args: [totalSupplyCalls],
  })

  const decoded = result.map((data, i) => {
    const token = foundTokens[i]
    return {
      token,
      totalSupply: decodeFunctionResult({
        abi: erc20Abi,
        functionName: 'totalSupply',
        data,
      }),
    }
  })

  decoded.forEach((data) => {
    if (data.totalSupply > 0n) {
      console.log(
        `${data.token.symbol}: ${formatUnits(
          data.totalSupply,
          data.token.decimals,
        )} ${data.token.symbol}`,
      )
    }
  })
}

async function processBatchIndividually(
  chainClient: PublicClient,
  batch: Token[],
  chain: (typeof CHAINS)[number],
) {
  for (const token of batch) {
    try {
      const l2TokenAddress = (await chainClient.readContract({
        address: bridge,
        abi: bridgeAbi,
        functionName: 'getTokenWrappedAddress',
        args: [0, token.address.toString() as Address],
      })) as Address

      if (l2TokenAddress === '0x0000000000000000000000000000000000000000') {
        continue
      }

      const totalSupply = (await chainClient.readContract({
        address: l2TokenAddress,
        abi: erc20Abi,
        functionName: 'totalSupply',
      })) as bigint

      if (totalSupply > 0n) {
        console.log(
          `${token.symbol} on ${chain.name}: ${formatUnits(
            totalSupply,
            token.decimals,
          )} ${token.symbol}`,
        )
      }
    } catch (error) {
      console.error(
        `Error fetching total supply for ${token.symbol} on ${chain.name}:`,
        error,
      )
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
