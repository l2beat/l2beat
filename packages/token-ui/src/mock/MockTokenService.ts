import { assertUnreachable } from '~/utils/assertUnreachable'
import type { AbstractToken, DeployedToken } from './types'

type Intent = AddAbstractTokenIntent | AddDeployedTokenIntent

interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  abstractToken: AbstractToken
}

interface AddDeployedTokenIntent {
  type: 'AddDeployedTokenIntent'
  deployedToken: DeployedToken
}

export type Command = AddAbstractTokenCommand | AddDeployedTokenCommand

interface AddAbstractTokenCommand {
  type: 'AddAbstractTokenCommand'
  abstractToken: AbstractToken
}

interface AddDeployedTokenCommand {
  type: 'AddDeployedTokenCommand'
  deployedToken: DeployedToken
}

export interface Plan {
  intent: Intent
  commands: Command[]
}

class MockTokenService {
  abstractTokens: AbstractToken[] = [
    {
      id: 'btc',
      symbol: 'BTC',
      category: 'btc',
      iconUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      coingeckoId: 'bitcoin',
      coingeckoListingTimestamp: new Date('2013-04-28'),
      comment: 'Bitcoin',
    },
    {
      id: 'eth',
      symbol: 'ETH',
      category: 'ether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      coingeckoId: 'ethereum',
      coingeckoListingTimestamp: new Date('2015-08-07'),
      comment: 'Ethereum',
    },
    {
      id: 'usdc',
      issuer: 'Circle',
      symbol: 'USDC',
      category: 'stablecoin',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
      coingeckoId: 'usd-coin',
      coingeckoListingTimestamp: new Date('2018-10-08'),
      comment: 'Some comment about USDC',
    },
    {
      id: 'random',
      issuer: 'Pump.fun',
      symbol: 'RANDOM',
      category: 'other',
      coingeckoId: 'random',
      coingeckoListingTimestamp: new Date('2021-01-01'),
      comment: 'Some comment about RANDOM',
    },
  ]
  deployedTokens: DeployedToken[] = [
    {
      id: 'ethereum-0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      chain: 'ethereum',
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      abstractTokenId: 'btc',
      symbol: 'WBTC',
      decimals: 8,
      deploymentTimestamp: new Date('2019-01-30'),
      comment: 'Wrapped Bitcoin on Ethereum',
    },
    {
      id: 'ethereum-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      chain: 'ethereum',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      abstractTokenId: 'usdc',
      symbol: 'USDC',
      decimals: 6,
      deploymentTimestamp: new Date('2018-09-26'),
      comment: 'USD Coin on Ethereum',
    },
    {
      id: 'polygon-0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      chain: 'polygon',
      address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      abstractTokenId: 'usdc',
      symbol: 'USDC.e',
      decimals: 6,
      deploymentTimestamp: new Date('2020-05-31'),
      comment: 'USD Coin on Polygon',
    },
    {
      id: 'ethereum-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chain: 'ethereum',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      abstractTokenId: 'eth',
      symbol: 'WETH',
      decimals: 18,
      deploymentTimestamp: new Date('2017-12-12'),
      comment: 'Wrapped Ether on Ethereum',
    },
    {
      id: 'polygon-0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      chain: 'polygon',
      address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      abstractTokenId: 'eth',
      symbol: 'WETH',
      decimals: 18,
      deploymentTimestamp: new Date('2020-05-31'),
      comment: 'Wrapped Ether on Polygon',
    },
    {
      id: 'polygon-0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      chain: 'polygon',
      address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      abstractTokenId: 'btc',
      symbol: 'WBTC',
      decimals: 8,
      deploymentTimestamp: new Date('2020-05-31'),
      comment: 'Wrapped Bitcoin on Polygon',
    },
  ]

  getAbstractTokens() {
    return this.abstractTokens.map((token) => ({
      ...token,
      deployedTokens: this.deployedTokens.filter(
        (t) => t.abstractTokenId === token.id,
      ),
    }))
  }

  getChains() {
    return [
      'ethereum',
      'polygon',
      'arbitrum',
      'optimism',
      'bsc',
      'avalanche',
      'celo',
      'linea',
      'base',
      'polygonzkevm',
      'gnosis',
      'zksync2',
      'sepolia',
      'scroll',
      'mantle',
      'metis',
      'bobanetwork',
      'mode',
      'zora',
      'mantapacific',
      'blast',
      'kinto',
      'katana',
      'unichain',
      'ink',
      'everclear',
      'zircuit',
      'taiko',
      'facet',
    ]
  }

  plan(intent: Intent): Promise<Plan> {
    let commands: Command[]
    switch (intent.type) {
      case 'AddAbstractTokenIntent':
        commands = [
          {
            type: 'AddAbstractTokenCommand',
            abstractToken: intent.abstractToken,
          },
        ]
        break
      case 'AddDeployedTokenIntent':
        commands = [
          {
            type: 'AddDeployedTokenCommand',
            deployedToken: intent.deployedToken,
          },
        ]
        break
      default:
        assertUnreachable(intent)
    }

    // Simulate network delay
    return new Promise<Plan>((resolve) => {
      setTimeout(() => {
        resolve({
          intent,
          commands,
        })
      }, 1000)
    })
  }

  execute(plan: Plan) {
    for (const command of plan.commands) {
      this.executeCommand(command)
    }
    return {
      outcome: 'success',
    }
  }
  private executeCommand(command: Command) {
    switch (command.type) {
      case 'AddAbstractTokenCommand':
        this.abstractTokens.push(command.abstractToken)
        break
      case 'AddDeployedTokenCommand':
        this.deployedTokens.push(command.deployedToken)
        break
      default:
        assertUnreachable(command)
    }
  }
}

export const tokenService = new MockTokenService()
