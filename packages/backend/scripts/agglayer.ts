import { tokenList } from '@l2beat/config/src'
import {
  ChainId,
  EthereumAddress,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import {
  http,
  Address,
  PublicClient,
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
  formatEther,
  formatUnits,
  parseAbi,
} from 'viem'

const CHAINS = [
  {
    name: 'Polygon zkEVM',
    rpcUrl: 'https://zkevm-rpc.com',
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
const BRIDGE_ADDRESS = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe' as Address

const BRIDGE_ABI = parseAbi([
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])

const BATCH_SIZE = 100

const ERC20_ABI = parseAbi([
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
])

const MUTLICALL_ABI = parseAbi([
  'function aggregate((address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
])

const MULTICALL_ADDRESS =
  '0xcA11bde05977b3631167028862bE2a173976CA11' as Address

// Add Ethereum configuration
const ETHEREUM = {
  name: 'Ethereum',
  rpcUrl: 'https://eth.llamarpc.com',
}

const TIMESTAMP = UnixTime.fromDate(new Date('2024-09-01T00:00:00Z'))

const ethereumBalances: Record<string, number> = {}
const L2sBalances: Record<string, number> = {}

async function main() {
  const tokensOnEthereum = tokenList.filter(
    (token): token is typeof token & { address: EthereumAddress } =>
      token.chainId === ChainId.ETHEREUM && token.address !== undefined,
  )

  console.log(`Processing ${ETHEREUM.name} balances`)
  const ethereumClient = createPublicClient({
    transport: http(ETHEREUM.rpcUrl),
  })

  await getEthereumBalances(ethereumClient, tokensOnEthereum)

  for (const chain of CHAINS) {
    console.log(`Processing ${chain.name}`)

    const chainClient = createPublicClient({
      transport: http(chain.rpcUrl),
    })

    const currentBlock = await chainClient.getBlockNumber()

    console.log(`${chain.name} - Searching for block on or before ${TIMESTAMP}`)
    const blockOnTimestamp = await getBlockNumberAtOrBefore(
      TIMESTAMP,
      0,
      Number(currentBlock),
      chainClient.getBlock,
    )
    console.log(`${chain.name} - Found block ${blockOnTimestamp}`)

    const etherSupply = await chainClient.getBalance({
      address: BRIDGE_ADDRESS as Address,
      blockNumber: BigInt(blockOnTimestamp),
    })

    if (etherSupply > 0n) {
      const key = 'ETH'
      L2sBalances[key] =
        (L2sBalances[key] || 0) +
        Number(formatEther(chain.premintedEth - etherSupply))
    }

    console.log(`ETH: ${formatEther(chain.premintedEth - etherSupply)} ETH`)

    const supportsMulticall = await checkMulticallSupport(chainClient)

    await processBatches(
      chainClient,
      tokensOnEthereum,
      supportsMulticall,
      BigInt(blockOnTimestamp),
    )

    console.log('---')
  }

  Object.entries(L2sBalances).forEach(([symbol, balance]) => {
    if (ethereumBalances[symbol] - balance !== 0) {
      console.log(`Diff: ${ethereumBalances[symbol] - balance} ${symbol}`)
    }
  })
}

async function getEthereumBalances(
  ethereumClient: PublicClient,
  tokensOnEthereum: Token[],
) {
  const currentBlock = await ethereumClient.getBlockNumber()

  console.log(`Ethereum - Searching for block on or before ${TIMESTAMP}`)
  const ethereumBlock = await getBlockNumberAtOrBefore(
    TIMESTAMP,
    0,
    Number(currentBlock),
    ethereumClient.getBlock,
  )
  console.log(`Ethereum - Found block ${ethereumBlock}`)

  const ethereumEtherSupply = await ethereumClient.getBalance({
    address: BRIDGE_ADDRESS as Address,
    blockNumber: BigInt(ethereumBlock),
  })

  ethereumBalances['ETH'] = Number(formatEther(ethereumEtherSupply))

  for (let i = 0; i < tokensOnEthereum.length; i += BATCH_SIZE) {
    const batch = tokensOnEthereum.slice(i, i + BATCH_SIZE)

    const calls = batch.map((token) => ({
      target: token.address.toString() as Address,
      callData: encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [BRIDGE_ADDRESS],
      }),
    }))

    const [, returnData] = await ethereumClient.readContract({
      address: MULTICALL_ADDRESS,
      abi: MUTLICALL_ABI,
      functionName: 'aggregate',
      args: [calls],
      blockNumber: BigInt(ethereumBlock),
    })

    returnData.forEach((data, i) => {
      const token = batch[i]
      const bridgeBalance = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        data,
      })

      if (bridgeBalance > 0n) {
        const key = token.symbol
        ethereumBalances[key] =
          (ethereumBalances[key] || 0) +
          Number(formatUnits(bridgeBalance, token.decimals))
      }
    })
  }
}

async function checkMulticallSupport(
  chainClient: PublicClient,
): Promise<boolean> {
  try {
    await chainClient.readContract({
      address: MULTICALL_ADDRESS,
      abi: MUTLICALL_ABI,
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
  supportsMulticall: boolean,
  blockNumber: bigint,
) {
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE)

    if (supportsMulticall) {
      await processBatchWithMulticall(chainClient, batch, blockNumber)
    } else {
      await processBatchIndividually(chainClient, batch, blockNumber)
    }
  }
}

async function processBatchWithMulticall(
  chainClient: PublicClient,
  batch: Token[],
  blockNumber: bigint,
) {
  const calls = batch.map((token) => ({
    target: BRIDGE_ADDRESS,
    callData: encodeFunctionData({
      abi: BRIDGE_ABI,
      functionName: 'getTokenWrappedAddress',
      args: [0, token.address.toString() as Address],
    }),
  }))

  const [, tokenAddressesReturnData] = await chainClient.readContract({
    address: MULTICALL_ADDRESS,
    abi: MUTLICALL_ABI,
    functionName: 'aggregate',
    args: [calls],
    blockNumber,
  })

  const foundTokens = tokenAddressesReturnData
    .map((data, i) => {
      const token = batch[i]
      const l2TokenAddress = decodeFunctionResult({
        abi: BRIDGE_ABI,
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
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      }),
    }
  })

  const [, totalSupplyReturnData] = await chainClient.readContract({
    address: MULTICALL_ADDRESS,
    abi: MUTLICALL_ABI,
    functionName: 'aggregate',
    args: [totalSupplyCalls],
    blockNumber,
  })

  const decoded = totalSupplyReturnData.map((data, i) => {
    const token = foundTokens[i]
    return {
      token,
      totalSupply: decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'totalSupply',
        data,
      }),
    }
  })

  decoded.forEach((data) => {
    if (data.totalSupply > 0n) {
      const key = data.token.symbol
      L2sBalances[key] =
        (L2sBalances[key] || 0) +
        Number(formatUnits(data.totalSupply, data.token.decimals))

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
  blockNumber: bigint,
) {
  for (const token of batch) {
    try {
      const l2TokenAddress = (await chainClient.readContract({
        address: BRIDGE_ADDRESS,
        abi: BRIDGE_ABI,
        functionName: 'getTokenWrappedAddress',
        args: [0, token.address.toString() as Address],
        blockNumber,
      })) as Address

      if (l2TokenAddress === '0x0000000000000000000000000000000000000000') {
        continue
      }

      const totalSupply = (await chainClient.readContract({
        address: l2TokenAddress,
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      })) as bigint

      if (totalSupply > 0n) {
        console.log(
          `${token.symbol}: ${formatUnits(totalSupply, token.decimals)} ${
            token.symbol
          }`,
        )
      }
    } catch (error) {
      console.error(`Error fetching total supply for ${token.symbol}`, error)
    }
  }
}

async function getBlockNumberAtOrBefore(
  timestamp: UnixTime,
  start: number,
  end: number,
  getBlock: ({
    blockNumber,
  }: { blockNumber: bigint }) => Promise<{ timestamp: bigint }>,
): Promise<number> {
  while (start + 1 < end) {
    const mid = start + Math.floor((end - start) / 2)
    const midBlock = await getBlock({
      blockNumber: BigInt(mid),
    })
    const midTimestamp = new UnixTime(Number(midBlock.timestamp))
    if (midTimestamp.lte(timestamp)) {
      start = mid
    } else {
      end = mid
    }
  }

  return start
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('An error occurred:', error)
    process.exit(1)
  })
