import { UnixTime } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { InsightBacking, InsightReport } from './InsightReport'

const NO_BACKING: InsightBacking = {
  mintedAgainst: [],
  burnAndMint: [],
  lockedFor: [],
  unknownRole: [],
}

export function getMockInsightReport(holder: string): InsightReport {
  return {
    holder,
    ensName: null,
    blockNumber: 24_000_000,
    priceTimestamp: UnixTime.toStartOf(UnixTime.now(), 'hour'),
    totalValueUsd: 1_208_514.02,
    unreviewedValueUsd: 0,
    untrackedTokenCount: 9_871,
    emptyTrackedTokenCount: 412,
    unreadableTokenCount: 1,
    holdings: [
      {
        address: 'native',
        symbol: 'ETH',
        iconUrl:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        issuer: 'ethereum',
        category: 'ether',
        reviewed: true,
        abstractTokenId: 'C0Hmkq',
        balance: '300000000000000000000',
        decimals: 18,
        valueUsd: 1_005_000,
        backing: NO_BACKING,
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        iconUrl:
          'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
        issuer: 'circle',
        category: 'stablecoin',
        reviewed: true,
        abstractTokenId: 'usdc01',
        balance: '200000000000',
        decimals: 6,
        valueUsd: 200_014.02,
        backing: {
          ...NO_BACKING,
          burnAndMint: [
            {
              plugin: 'cctp-v2',
              bridges: [],
              chains: [chain('arbitrum', 'Arbitrum One')],
            },
          ],
          lockedFor: [
            {
              plugin: 'opstack',
              bridges: [],
              chains: [chain('optimism', 'OP Mainnet')],
            },
          ],
        },
      },
      {
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        symbol: 'WBTC',
        iconUrl:
          'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857',
        issuer: 'bitgo',
        category: 'btc',
        reviewed: true,
        abstractTokenId: 'WBTC01',
        balance: '3500000',
        decimals: 8,
        valueUsd: 3_500,
        backing: NO_BACKING,
      },
      {
        address: '0x0000000000000000000000000000000000000001',
        symbol: 'wSOL',
        iconUrl: null,
        issuer: null,
        category: null,
        reviewed: false,
        abstractTokenId: null,
        balance: '1000000000',
        decimals: 9,
        valueUsd: null,
        backing: {
          ...NO_BACKING,
          mintedAgainst: [
            {
              plugin: 'wormhole',
              bridges: [],
              chains: [chain('solana', 'Solana')],
            },
          ],
        },
      },
    ],
  }
}

function chain(id: string, name: string) {
  return { id, name, iconUrl: manifest.getUrl(`/icons/${id}.png`) }
}
