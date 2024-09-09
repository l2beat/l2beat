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
    name: 'ZKsync Era',
    etherAddress: '0x000000000000000000000000000000000000800A',
    rpcUrl: 'https://mainnet.era.zksync.io',
    bridgeAddress: '0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102',
  },
  {
    name: 'Cronos',
    etherAddress: '0x898b3560affd6d955b1574d87ee09e46669c60ea',
    rpcUrl: 'https://mainnet.zkevm.cronos.org',
    bridgeAddress: '0x309429DE3621992Cb0ab8982A448c9Cc5c38405b',
  },
]

const ETHEREUM_BRIDGE_ADDRESS =
  '0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB' as Address

const L2_BRIDGE_ABI = parseAbi([
  'function l2TokenAddress(address _l1Token) public view returns (address)',
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
  const tokensOnEthereum = tokenList
    .filter(
      (token): token is typeof token & { address: EthereumAddress } =>
        token.chainId === ChainId.ETHEREUM && token.address !== undefined,
    )
    .concat([
      {
        address: EthereumAddress('0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2'),
        symbol: 'zkCRO',
        coingeckoId: CoingeckoId('cronos-zkevm-cro'),
        decimals: 18,
      } as Token & { address: EthereumAddress },
    ])

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

  const tokensFoundOnEthereum = Object.keys(ethereumBalances)

  const tokensToCheck = tokensOnEthereum.filter((t) =>
    tokensFoundOnEthereum.includes(t.symbol),
  )

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

    const etherSupply = await chainClient.readContract({
      abi: ERC20_ABI,
      address: chain.etherAddress as Address,
      functionName: 'totalSupply',
    })

    if (etherSupply > 0n) {
      const tokenPrice = prices.get('ETH')
      if (!tokenPrice) {
        console.log(`ETH: ${formatEther(etherSupply)} ETH`)
      } else {
        const chainTVL = tvlMap.get(chain.name) ?? 0
        tvlMap.set(
          chain.name,
          chainTVL + tokenPrice * Number(formatEther(etherSupply)),
        )
        console.log(
          `ETH: ${formatEther(etherSupply)} ETH --- $${
            tokenPrice * Number(formatEther(etherSupply))
          }`,
        )
      }
      const key = 'ETH'
      L2sBalances[key] =
        (L2sBalances[key] || 0) + Number(formatEther(etherSupply))
    }

    const supportsMulticall = await checkMulticallSupport(chainClient)

    await processBatches(
      chainClient,
      tokensToCheck,
      supportsMulticall,
      chain.name,
      chain.bridgeAddress as Address,
    )

    // Special case for zkCRO
    if (chain.name === 'Cronos') {
      const ethereumClient = createPublicClient({
        transport: http(ETHEREUM.rpcUrl),
      })
      const zkCROSupply = await ethereumClient.readContract({
        abi: ERC20_ABI,
        address: '0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2' as Address,
        functionName: 'balanceOf',
        args: [ETHEREUM_BRIDGE_ADDRESS],
      })

      if (zkCROSupply > 0n) {
        const tokenPrice = prices.get('zkCRO')
        if (!tokenPrice) {
          console.log(`zkCRO: ${formatUnits(zkCROSupply, 18)} zkCRO`)
        } else {
          const chainTVL = tvlMap.get(chain.name) ?? 0
          tvlMap.set(
            chain.name,
            chainTVL + tokenPrice * Number(formatUnits(zkCROSupply, 18)),
          )
          console.log(
            `zkCRO: ${formatUnits(zkCROSupply, 18)} zkCRO --- $${
              tokenPrice * Number(formatUnits(zkCROSupply, 18))
            }`,
          )
        }
        const key = 'zkCRO'
        L2sBalances[key] =
          (L2sBalances[key] || 0) + Number(formatUnits(zkCROSupply, 18))
      }
    }

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
    address: ETHEREUM_BRIDGE_ADDRESS as Address,
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
        args: [ETHEREUM_BRIDGE_ADDRESS],
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
  tokens: Token[],
  supportsMulticall: boolean,
  chainName: string,
  chainBridge: Address,
) {
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE)

    if (supportsMulticall) {
      await processBatchWithMulticall(
        chainClient,
        batch,
        chainName,
        chainBridge,
      )
    } else {
      await processBatchIndividually(chainClient, batch, chainName, chainBridge)
    }
  }
}

async function processBatchWithMulticall(
  chainClient: PublicClient,
  batch: Token[],
  chainName: string,
  chainBridge: Address,
) {
  const calls = batch.map((token) => ({
    target: chainBridge,
    callData: encodeFunctionData({
      abi: L2_BRIDGE_ABI,
      functionName: 'l2TokenAddress',
      args: [token.address?.toString() as Address],
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
        abi: L2_BRIDGE_ABI,
        functionName: 'l2TokenAddress',
        data,
      })

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

  decoded.forEach((data) => {
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
  chainBridge: Address,
) {
  for (const token of batch) {
    const l2TokenAddress = (await chainClient.readContract({
      address: chainBridge,
      abi: L2_BRIDGE_ABI,
      functionName: 'l2TokenAddress',
      args: [token.address?.toString() as Address],
    })) as Address

    if (l2TokenAddress === '0x0000000000000000000000000000000000000000') {
      continue
    }

    try {
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
          } --- $${
            tokenPrice * Number(formatUnits(totalSupply, token.decimals))
          }`,
        )
      }
      // biome-ignore lint: no display
    } catch (e) {}
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
