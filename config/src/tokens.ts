export interface TokenInfo {
  /** Token name as dictated by the token contract */
  name: string
  /** Token symbol as dictated by the token contract */
  symbol: string
  /** Token address. Only Ether has no address */
  address?: string
  /** Token decimals as dictated by the token contract */
  decimals: number
  /**
   * Token id used by the coingecko api that allows for fetching the price.
   * Find yours in here (glhf): https://api.coingecko.com/api/v3/coins/list
   */
  coingeckoId: string
  /** Block number of the token contract deployment transaction */
  sinceBlock: number
}

export const tokenList: TokenInfo[] = [
  {
    name: '1INCH Token',
    symbol: '1INCH',
    address: '0x111111111117dC0aa78b770fA6A738034120C302',
    decimals: 18,
    coingeckoId: '1inch',
    sinceBlock: 11511393,
  },
  {
    name: 'Aave Token',
    symbol: 'AAVE',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    decimals: 18,
    coingeckoId: 'aave',
    sinceBlock: 10926829,
  },
  {
    name: 'AlphaToken',
    symbol: 'ALPHA',
    address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
    decimals: 18,
    coingeckoId: 'alpha-finance',
    sinceBlock: 10943736,
  },
  {
    name: 'Binance USD',
    symbol: 'BUSD',
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    decimals: 18,
    coingeckoId: 'binance-usd',
    sinceBlock: 8493105,
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    decimals: 18,
    coingeckoId: 'binancecoin',
    sinceBlock: 3978343,
  },
  {
    name: 'ChainLink Token',
    symbol: 'LINK',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
    coingeckoId: 'chainlink',
    sinceBlock: 4281611,
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    coingeckoId: 'dai',
    sinceBlock: 8928158,
  },
  {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    coingeckoId: 'ethereum',
    sinceBlock: 0,
  },
  {
    name: 'GateChainToken',
    symbol: 'GT',
    address: '0xE66747a101bFF2dBA3697199DCcE5b743b454759',
    decimals: 18,
    coingeckoId: 'gatechain-token',
    sinceBlock: 7726894,
  },
  {
    name: 'Golem Network Token',
    symbol: 'GLM',
    address: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429',
    decimals: 18,
    coingeckoId: 'golem',
    sinceBlock: 11281056,
  },
  {
    name: 'Huobi BTC',
    symbol: 'HBTC',
    address: '0x0316EB71485b0Ab14103307bf65a021042c6d380',
    decimals: 18,
    coingeckoId: 'huobi-btc',
    sinceBlock: 9076087,
  },
  {
    name: 'HuobiToken',
    symbol: 'HT',
    address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
    decimals: 18,
    coingeckoId: 'huobi-token',
    sinceBlock: 5005233,
  },
  {
    name: 'LoopringCoin V2',
    symbol: 'LRC',
    address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    decimals: 18,
    coingeckoId: 'loopring',
    sinceBlock: 7544036,
  },
  {
    name: 'Maker',
    symbol: 'MKR',
    address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    decimals: 18,
    coingeckoId: 'maker',
    sinceBlock: 4620855,
  },
  {
    name: 'MX Token',
    symbol: 'MX',
    address: '0x11eeF04c884E24d9B7B4760e7476D06ddF797f36',
    decimals: 18,
    coingeckoId: 'mx-token',
    sinceBlock: 5828860,
  },
  {
    name: 'OKB',
    symbol: 'OKB',
    address: '0x75231F58b43240C9718Dd58B4967c5114342a86c',
    decimals: 18,
    coingeckoId: 'okb',
    sinceBlock: 7641712,
  },
  {
    name: 'Renpublic',
    symbol: 'REN',
    address: '0x408e41876cCCDC0F92210600ef50372656052a38',
    decimals: 18,
    coingeckoId: 'republic-protocol',
    sinceBlock: 4827494,
  },
  {
    name: 'SushiToken',
    symbol: 'SUSHI',
    address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    decimals: 18,
    coingeckoId: 'sushi',
    sinceBlock: 10736094,
  },
  {
    name: 'Synthetix Network Token',
    symbol: 'SNX',
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    decimals: 18,
    coingeckoId: 'havven',
    sinceBlock: 8314597,
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    coingeckoId: 'tether',
    sinceBlock: 4634748,
  },
  {
    name: 'THORChain ETH.RUNE',
    symbol: 'RUNE',
    address: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
    decimals: 18,
    coingeckoId: 'thorchain-erc20',
    sinceBlock: 11644425,
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
    coingeckoId: 'uniswap',
    sinceBlock: 10861674,
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    coingeckoId: 'usd-coin',
    sinceBlock: 6082465,
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    coingeckoId: 'wrapped-bitcoin',
    sinceBlock: 6766284,
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    coingeckoId: 'weth',
    sinceBlock: 4719568,
  },
  {
    name: 'yearn.finance',
    symbol: 'YFI',
    address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    decimals: 18,
    coingeckoId: 'yearn-finance',
    sinceBlock: 10475744,
  },
  {
    name: 'YFII.finance',
    symbol: 'YFII',
    address: '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83',
    decimals: 18,
    coingeckoId: 'yfii-finance',
    sinceBlock: 10535249,
  },
  {
    name: 'Zks',
    symbol: 'ZKS',
    address: '0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6',
    decimals: 18,
    coingeckoId: 'zkswap',
    sinceBlock: 11305469,
  },
]

const tokenMap = new Map(tokenList.map((t) => [t.symbol, t] as const))

export function getTokenBySymbol(symbol: string) {
  const token = tokenMap.get(symbol)
  if (!token) {
    throw new TypeError(`Unknown token ${symbol}`)
  }
  return token
}
