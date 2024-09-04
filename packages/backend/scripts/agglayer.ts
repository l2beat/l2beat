import { tokenList } from '@l2beat/config/src'
import {
  assert,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  notUndefined,
} from '@l2beat/shared-pure'
import fetch from 'node-fetch'
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
    premintedNative: 200000000000000000000000000n,
    nativeToken: 'ETH',
  },
  {
    name: 'X Layer',
    rpcUrl: 'https://rpc.xlayer.tech',
    premintedNative: 0n,
    nativeToken: 'OKB',
    additionalTokens: [
      {
        symbol: 'ETH',
        address: EthereumAddress('0x5a77f1443d16ee5761d310e38b62f77f726bc71c'),
        decimals: 18,
        alreadyWrapped: true,
      } as unknown as Token & { alreadyWrapped?: boolean },
    ],
  },
  {
    name: 'Astar zkEVM',
    rpcUrl: 'https://rpc.startale.com/astar-zkevm',
    premintedNative: 340282366920938463463374607431768211455n,
    nativeToken: 'ETH',
  },
  {
    name: 'GPT',
    rpcUrl: 'https://sequencer.gptprotocol.io',
    premintedNative: 340282366920938463463374607431768211455n,
    nativeToken: 'GPT',
  },
  {
    name: 'Silicon',
    rpcUrl: 'https://rpc.silicon.network',
    premintedNative: 340282366920938463463374607431768211455n,
    nativeToken: 'ETH',
  },
  {
    name: 'Wirex',
    rpcUrl: 'https://pay-chain-rpc.wirexpaychain.com',
    premintedNative: 340282366920938463463374607431768211455n,
    nativeToken: 'ETH',
  },
]

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

const ethereumBalances: Record<
  string,
  { amount: number; coingeckoId: CoingeckoId }
> = {}
const L2sBalances: Record<string, number> = {}

const tvlMap = new Map<string, number>()
let prices: Map<string, number>

async function main() {
  const tokensOnEthereum = tokenList.filter(
    (token): token is typeof token & { address: EthereumAddress } =>
      token.chainId === ChainId.ETHEREUM && token.address !== undefined,
  )

  prices = await fetchPrices([
    ...tokensOnEthereum.map(({ coingeckoId, symbol }) => ({
      symbol,
      coingeckoId,
    })),
    {
      symbol: 'ETH',
      coingeckoId: CoingeckoId('ethereum'),
    },
  ])
  console.log('Fetched prices for', prices.size, 'tokens')

  await getEthereumBalances(tokensOnEthereum)

  const tvl = tvlMap.get('Ethereum')
  if (tvl) {
    console.log('---')
    console.log(`TVL: $${formatNumberWithCommas(tvl)}`)
  }
  console.log('---------------------------------')

  for (const chain of CHAINS) {
    console.log(`Processing ${chain.name}`)

    const chainClient = createPublicClient({
      transport: http(chain.rpcUrl),
    })

    const etherSupply = await chainClient.getBalance({
      address: BRIDGE_ADDRESS as Address,
    })

    if (etherSupply > 0n) {
      const tokenPrice = prices.get(chain.nativeToken)
      if (!tokenPrice) {
        console.log(
          `${chain.nativeToken}: ${formatEther(
            chain.premintedNative - etherSupply,
          )} ${chain.nativeToken}`,
        )
      } else {
        const chainTVL = tvlMap.get(chain.name) ?? 0
        tvlMap.set(
          chain.name,
          chainTVL +
            tokenPrice *
              Number(formatEther(chain.premintedNative - etherSupply)),
        )
        console.log(
          `${chain.nativeToken}: ${formatEther(
            chain.premintedNative - etherSupply,
          )} ${chain.nativeToken} --- $${
            tokenPrice *
            Number(formatEther(chain.premintedNative - etherSupply))
          }`,
        )
      }
      const key = chain.nativeToken
      L2sBalances[key] =
        (L2sBalances[key] || 0) +
        Number(formatEther(chain.premintedNative - etherSupply))
    }

    const supportsMulticall = await checkMulticallSupport(chainClient)

    await processBatches(
      chainClient,
      [...tokensOnEthereum, ...(chain.additionalTokens ?? [])],
      supportsMulticall,
      chain.name,
    )

    console.log('---')
    const tvl = tvlMap.get(chain.name)
    if (tvl) {
      console.log(`TVL: $${formatNumberWithCommas(tvl)}`)
    }
    console.log('---------------------------------')
  }

  Object.entries(L2sBalances).forEach(([symbol, balance]) => {
    if (symbol === 'GPT') {
      console.log(`Diff: ${0 - balance} ${symbol}`)
      return
    }
    if (ethereumBalances[symbol].amount - balance !== 0) {
      console.log(
        `Diff: ${ethereumBalances[symbol].amount - balance} ${symbol}`,
      )
    }
  })

  console.log('---------------------------------')
  const ethTvl = tvlMap.get('Ethereum')
  const totalTvl = Array.from(tvlMap.entries())
    .filter(([key]) => key !== 'Ethereum')
    .reduce((acc, [, value]) => acc + value, 0)
  if (ethTvl && totalTvl) {
    console.log(`Total TVL Diff: $${formatNumberWithCommas(ethTvl - totalTvl)}`)
  }
}

export function formatNumberWithCommas(value: number): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formattedNumber
}

async function getEthereumBalances(tokensOnEthereum: Token[]) {
  console.log(`Processing ${ETHEREUM.name} balances`)
  const ethereumClient = createPublicClient({
    transport: http(ETHEREUM.rpcUrl),
  })

  const ethereumEtherSupply = await ethereumClient.getBalance({
    address: BRIDGE_ADDRESS as Address,
  })

  if (ethereumEtherSupply > 0n) {
    const tokenPrice = prices.get('ETH')
    assert(tokenPrice !== undefined, `Price not found for ETH`)
    if (tokenPrice) {
      const chainTVL = tvlMap.get('Ethereum') ?? 0
      tvlMap.set(
        'Ethereum',
        chainTVL + tokenPrice * Number(formatEther(ethereumEtherSupply)),
      )
    }
    ethereumBalances['ETH'] = {
      amount: Number(formatEther(ethereumEtherSupply)),
      coingeckoId: CoingeckoId('ethereum'),
    }
    console.log(
      `ETH: ${formatEther(ethereumEtherSupply)} ETH --- $${
        tokenPrice * Number(formatEther(ethereumEtherSupply))
      }`,
    )
  }

  for (let i = 0; i < tokensOnEthereum.length; i += BATCH_SIZE) {
    const batch = tokensOnEthereum.slice(i, i + BATCH_SIZE)

    const calls = batch.map((token) => ({
      target: token.address?.toString() as Address,
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
    })

    returnData.forEach((data, i) => {
      const token = batch[i]
      const bridgeBalance = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        data,
      })

      if (bridgeBalance > 0n) {
        const tokenPrice = prices.get(token.symbol)
        assert(tokenPrice !== undefined, `Price not found for ${token.symbol}`)
        if (tokenPrice) {
          const chainTVL = tvlMap.get('Ethereum') ?? 0
          tvlMap.set(
            'Ethereum',
            chainTVL +
              tokenPrice * Number(formatUnits(bridgeBalance, token.decimals)),
          )
        }
        const key = token.symbol
        ethereumBalances[key] = {
          amount:
            (ethereumBalances[key]?.amount || 0) +
            Number(formatUnits(bridgeBalance, token.decimals)),
          coingeckoId: ethereumBalances[key]?.coingeckoId || token.coingeckoId,
        }

        console.log(
          `${token.symbol}: ${formatUnits(bridgeBalance, token.decimals)} ${
            token.symbol
          } --- $${
            tokenPrice * Number(formatUnits(bridgeBalance, token.decimals))
          }`,
        )
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
  tokens: (Token & { alreadyWrapped?: boolean })[],
  supportsMulticall: boolean,
  chainName: string,
) {
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE)

    if (supportsMulticall) {
      await processBatchWithMulticall(chainClient, batch, chainName)
    } else {
      await processBatchIndividually(chainClient, batch, chainName)
    }
  }
}

async function processBatchWithMulticall(
  chainClient: PublicClient,
  batch: (Token & { alreadyWrapped?: boolean })[],
  chainName: string,
) {
  const tokens = batch.filter((token) => !token.alreadyWrapped)
  const additionalTokens = batch.filter((token) => token.alreadyWrapped)

  const calls = tokens.map((token) => ({
    target: BRIDGE_ADDRESS,
    callData: encodeFunctionData({
      abi: BRIDGE_ABI,
      functionName: 'getTokenWrappedAddress',
      args: [0, token.address?.toString() as Address],
    }),
  }))

  const [, tokenAddressesReturnData] = await chainClient.readContract({
    address: MULTICALL_ADDRESS,
    abi: MUTLICALL_ABI,
    functionName: 'aggregate',
    args: [calls],
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

  const additionalTotalSupplyCalls = additionalTokens.map((data) => {
    return {
      target: data.address as unknown as Address,
      callData: encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      }),
    }
  })

  const [, additionalTotalSupplyReturnData] = await chainClient.readContract({
    address: MULTICALL_ADDRESS,
    abi: MUTLICALL_ABI,
    functionName: 'aggregate',
    args: [additionalTotalSupplyCalls],
  })

  const additionalDecoded = additionalTotalSupplyReturnData.map((data, i) => {
    const token = additionalTokens[i]
    return {
      token,
      totalSupply: decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'totalSupply',
        data,
      }),
    }
  })

  additionalDecoded.concat(decoded).forEach((data) => {
    if (data.totalSupply > 0n) {
      const tokenPrice = prices.get(data.token.symbol)
      if (!tokenPrice) {
        console.log(
          `${data.token.symbol}: ${formatUnits(
            data.totalSupply,
            data.token.decimals,
          )} ${data.token.symbol}`,
        )
        return
      }
      assert(
        tokenPrice !== undefined,
        `Price not found for ${data.token.symbol}`,
      )
      if (tokenPrice) {
        const chainTVL = tvlMap.get(chainName) ?? 0
        tvlMap.set(
          chainName,
          chainTVL +
            tokenPrice *
              Number(formatUnits(data.totalSupply, data.token.decimals)),
        )
      }
      const key = data.token.symbol
      L2sBalances[key] =
        (L2sBalances[key] || 0) +
        Number(formatUnits(data.totalSupply, data.token.decimals))

      console.log(
        `${data.token.symbol}: ${formatUnits(
          data.totalSupply,
          data.token.decimals,
        )} ${data.token.symbol} --- $${
          tokenPrice *
          Number(formatUnits(data.totalSupply, data.token.decimals))
        }`,
      )
    }
  })
}

async function processBatchIndividually(
  chainClient: PublicClient,
  batch: Token[],
  chainName: string,
) {
  for (const token of batch) {
    try {
      const l2TokenAddress = (await chainClient.readContract({
        address: BRIDGE_ADDRESS,
        abi: BRIDGE_ABI,
        functionName: 'getTokenWrappedAddress',
        args: [0, token.address?.toString() as Address],
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
        const tokenPrice = prices.get(token.symbol)
        assert(tokenPrice !== undefined, `Price not found for ${token.symbol}`)
        if (tokenPrice) {
          const chainTVL = tvlMap.get(chainName) ?? 0
          tvlMap.set(
            chainName,
            chainTVL +
              tokenPrice * Number(formatUnits(totalSupply, token.decimals)),
          )
        }
        const key = token.symbol
        L2sBalances[key] =
          (L2sBalances[key] || 0) +
          Number(formatUnits(totalSupply, token.decimals))
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

async function fetchPrices(
  tokens: {
    coingeckoId: CoingeckoId
    symbol: string
  }[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>()
  const ids = tokens
    .map((token) => token.coingeckoId)
    .filter(Boolean)
    .join(',')
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`

  try {
    const response = await fetch(url)
    const data = await response.json()

    for (const token of tokens) {
      if (token.coingeckoId && data[token.coingeckoId.toString()]) {
        prices.set(token.symbol, data[token.coingeckoId.toString()].usd)
      }
    }
  } catch (error) {
    console.error('Error fetching prices:', error)
  }

  return prices
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('An error occurred:', error)
    process.exit(1)
  })
