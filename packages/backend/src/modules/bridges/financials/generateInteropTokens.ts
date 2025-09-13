import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import {
  ChainConverter,
  CoingeckoId,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import { writeFileSync } from 'fs'

export interface InteropToken {
  coingeckoId: CoingeckoId
  symbol: string
  decimals: number
  addresses: { chain: string; address: EthereumAddress | 'native' }[]
}

const COINGECKO_OVERRIDES = [
  { symbol: 'FRAX', coingeckoId: CoingeckoId('frax') },
  { symbol: 'SOL', coingeckoId: CoingeckoId('solana') },
  { symbol: 'USDC', coingeckoId: CoingeckoId('usd-coin') },
  { symbol: 'USDC.e', coingeckoId: CoingeckoId('usd-coin') },
  { symbol: 'USDT', coingeckoId: CoingeckoId('tether') },
  { symbol: 'wBTC', coingeckoId: CoingeckoId('wrapped-bitcoin') },
  { symbol: 'WBTC', coingeckoId: CoingeckoId('wrapped-bitcoin') },
  { symbol: 'WETH', coingeckoId: CoingeckoId('weth') },
]

export async function generateInteropTokens() {
  const ps = new ProjectService()
  const logger = Logger.INFO

  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const chainConverter = new ChainConverter(chains)

  const mapping = new Map<
    string,
    {
      symbol: string
      decimals: number
      coingeckoId: CoingeckoId
      addresses: { chain: string; address: EthereumAddress | 'native' }[]
    }
  >()
  const blackList = new Set<string>()

  const tokens = await ps.getTokens()

  for (const t of tokens) {
    const mappedToken = mapping.get(t.symbol)

    if (!mappedToken) {
      mapping.set(t.symbol, {
        symbol: t.symbol,
        decimals: t.decimals,
        coingeckoId: t.coingeckoId,
        addresses: [
          {
            chain: chainConverter.toName(t.chainId),
            address: t.address ?? 'native',
          },
        ],
      })
      continue
    }

    if (mappedToken.decimals !== t.decimals) {
      logger.info('Different decimals for token', {
        symbol: t.symbol,
        decimals: [mappedToken?.decimals, t.decimals],
      })
      blackList.add(t.symbol)
    }

    if (mappedToken.coingeckoId !== t.coingeckoId) {
      const override = COINGECKO_OVERRIDES.find(
        (c) => c.symbol === mappedToken.symbol,
      )
      if (override) {
        mappedToken.coingeckoId = override.coingeckoId
      } else {
        logger.info('Different coingeckoId for token', {
          symbol: t.symbol,
          coingeckoId: [mappedToken.coingeckoId, t.coingeckoId],
        })
        blackList.add(t.symbol)
      }
    }

    if (
      mappedToken.addresses.find(
        (a) => a.chain === chainConverter.toName(t.chainId),
      )
    ) {
      logger.info('Duplicate token symbol on the same chain', {
        symbol: t.symbol,
        chainId: t.chainId,
      })
      blackList.add(t.symbol)
    } else {
      mappedToken.addresses.push({
        chain: chainConverter.toName(t.chainId),
        address: t.address ?? 'native',
      })
    }
  }

  logger.info('Blacklist', { blackList: Array.from(blackList.values()) })

  writeFileSync(
    './src/modules/bridges/financials/generatedInterop.json',
    JSON.stringify(
      Array.from(mapping.values()).sort((a, b) =>
        a.symbol.localeCompare(b.symbol),
      ),
      null,
      2,
    ) + '\n',
  )
}

generateInteropTokens().catch((e: unknown) => {
  console.error(e)
})
