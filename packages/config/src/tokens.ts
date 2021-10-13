/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

Because of this we will enforce the following requirements for adding a token to
this list:

1. The token MUST be locked inside one of the projects found in `./projects` as
   reported by etherscan.io
2. The token MUST satisfy at least one of the following:
  2.1. The token is associated with the project and marked as `associatedToken`
  2.2. The token is in the top 300 of coins as reported by coingecko.com
3. The token SHOULD be listed on Uniswap V2 or V3 with sufficient liquidity. If
   this is not satisfied getting the token price will be problematic. In the
   future more exchanges will be supported, e.g. SushiSwap.

Please also note that for the time being we (incorrectly) treat the token symbol
as the identifier. If your token symbol clashes with one of the existing tokens
you are out of luck. We will fix this in the future.

*/

export interface TokenInfo {
  /** Token name as dictated by the token contract */
  name: string
  /** Token symbol as dictated by the token contract */
  symbol: string
  /** Token address. Only Ether has no address */
  address?: string
  /** Token decimals as dictated by the token contract */
  decimals: number
  /** Block number of the token contract deployment transaction */
  sinceBlock: number
}

export const tokenList: TokenInfo[] = [
  {
    name: '0x Protocol Token',
    symbol: 'ZRX',
    address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    decimals: 18,
    sinceBlock: 4145415,
  },
  {
    name: '1INCH Token',
    symbol: '1INCH',
    address: '0x111111111117dC0aa78b770fA6A738034120C302',
    decimals: 18,
    sinceBlock: 11511393,
  },
  {
    name: 'Aave Token',
    symbol: 'AAVE',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    decimals: 18,
    sinceBlock: 10926829,
  },
  {
    name: 'AirSwap Token',
    symbol: 'AST',
    address: '0x27054b13b1B798B345b591a4d22e6562d47eA75a',
    decimals: 4,
    sinceBlock: 4352086,
  },
  {
    name: 'AlphaToken',
    symbol: 'ALPHA',
    address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
    decimals: 18,
    sinceBlock: 10943736,
  },
  {
    name: 'Badger',
    symbol: 'BADGER',
    address: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
    decimals: 18,
    sinceBlock: 11348423,
  },
  {
    name: 'Balancer',
    symbol: 'BAL',
    address: '0xba100000625a3754423978a60c9317c58a424e3D',
    decimals: 18,
    sinceBlock: 10299683,
  },
  {
    name: 'Bancor Network Token',
    symbol: 'BNT',
    address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    decimals: 18,
    sinceBlock: 3851136,
  },
  {
    name: 'Basic Attention Token',
    symbol: 'BAT',
    address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    decimals: 18,
    sinceBlock: 3788558,
  },
  {
    name: 'Binance USD',
    symbol: 'BUSD',
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    decimals: 18,
    sinceBlock: 8493105,
  },
  {
    name: 'BitClave',
    symbol: 'CAT',
    address: '0x1234567461d3f8Db7496581774Bd869C83D51c93',
    decimals: 18,
    sinceBlock: 4797027,
  },
  {
    name: 'Blockpass',
    symbol: 'PASS',
    address: '0xeE4458e052B533b1aABD493B5f8c4d85D7B263Dc',
    decimals: 6,
    sinceBlock: 5622827,
  },
  {
    name: 'CelerToken',
    symbol: 'CELR',
    address: '0x4F9254C83EB525f9FCf346490bbb3ed28a81C667',
    decimals: 18,
    sinceBlock: 7107317,
  },
  {
    name: 'Celsius',
    symbol: 'CEL',
    address: '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d',
    decimals: 4,
    sinceBlock: 5409020,
  },
  {
    name: 'ChainLink Token',
    symbol: 'LINK',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
    sinceBlock: 4281611,
  },
  {
    name: 'Compound',
    symbol: 'COMP',
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    decimals: 18,
    sinceBlock: 9601359,
  },
  {
    name: 'Compound USDT',
    symbol: 'cUSDT',
    address: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
    decimals: 8,
    sinceBlock: 9879363,
  },
  {
    name: 'CRO',
    symbol: 'CRO',
    address: '0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b',
    decimals: 8,
    sinceBlock: 6702068,
  },
  {
    name: 'Curve DAO Token',
    symbol: 'CRV',
    address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    decimals: 18,
    sinceBlock: 10647806,
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    sinceBlock: 8928158,
  },
  {
    name: 'DeversiFi Token',
    symbol: 'DVF',
    address: '0xDDdddd4301A082e62E84e43F474f044423921918',
    decimals: 18,
    sinceBlock: 12008914,
  },
  {
    name: 'DODO bird',
    symbol: 'DODO',
    address: '0x43Dfc4159D86F3A37A5A4B3D4580b888ad7d4DDd',
    decimals: 18,
    sinceBlock: 10956992,
  },
  {
    name: 'Dopex Governance Token',
    symbol: 'DPX',
    address: '0xEec2bE5c91ae7f8a338e1e5f3b5DE49d07AfdC81',
    decimals: 18,
    sinceBlock: 12674086,
  },
  {
    name: 'Dusk Network',
    symbol: 'DUSK',
    address: '0x940a2dB1B7008B6C776d4faaCa729d6d4A4AA551',
    decimals: 18,
    sinceBlock: 6867115,
  },
  {
    name: 'ElectrifyAsia',
    symbol: 'ELEC',
    address: '0xD49ff13661451313cA1553fd6954BD1d9b6E02b9',
    decimals: 18,
    sinceBlock: 5123691,
  },
  {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    sinceBlock: 0,
  },
  {
    name: 'Ethfinex Nectar Token',
    symbol: 'NEC',
    address: '0xCc80C051057B774cD75067Dc48f8987C4Eb97A5e',
    decimals: 18,
    sinceBlock: 5072026,
  },
  {
    name: 'GateChainToken',
    symbol: 'GT',
    address: '0xE66747a101bFF2dBA3697199DCcE5b743b454759',
    decimals: 18,
    sinceBlock: 7726894,
  },
  {
    name: 'Gnosis Token',
    symbol: 'GNO',
    address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    decimals: 18,
    sinceBlock: 3557596,
  },
  {
    name: 'Golem Network Token',
    symbol: 'GLM',
    address: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429',
    decimals: 18,
    sinceBlock: 11281056,
  },
  {
    name: 'Graph Token',
    symbol: 'GRT',
    address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    decimals: 18,
    sinceBlock: 11446769,
  },
  {
    name: 'Habitat Token',
    symbol: 'HBT',
    address: '0x0aCe32f6E87Ac1457A5385f8eb0208F37263B415',
    decimals: 10,
    sinceBlock: 12009449,
  },
  {
    name: 'Hermez Network Token',
    symbol: 'HEZ',
    address: '0xEEF9f339514298C6A857EfCfC1A762aF84438dEE',
    decimals: 18,
    sinceBlock: 11056775,
  },
  {
    name: 'Kyber Network Crystal',
    symbol: 'KNC',
    address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
    decimals: 18,
    sinceBlock: 4264898,
  },
  {
    name: 'Land',
    symbol: 'LAND',
    address: '0x3258cd8134b6b28e814772dD91D5EcceEa512818',
    decimals: 18,
    sinceBlock: 11567575,
  },
  {
    name: 'Leverj Gluon',
    symbol: 'L2',
    address: '0xBbff34E47E559ef680067a6B1c980639EEb64D24',
    decimals: 18,
    sinceBlock: 11096120,
  },
  {
    name: 'Lido DAO Token',
    symbol: 'LDO',
    address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
    decimals: 18,
    sinceBlock: 11473216,
  },
  {
    name: 'LION',
    symbol: 'LION',
    address: '0x2167FB82309CF76513E83B25123f8b0559d6b48f',
    decimals: 18,
    sinceBlock: 4639529,
  },
  {
    name: 'LoopringCoin V2',
    symbol: 'LRC',
    address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    decimals: 18,
    sinceBlock: 7544036,
  },
  {
    name: 'Maker',
    symbol: 'MKR',
    address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    decimals: 18,
    sinceBlock: 4620855,
  },
  {
    name: 'MATH Token',
    symbol: 'MATH',
    address: '0x08d967bb0134F2d07f7cfb6E246680c53927DD30',
    decimals: 18,
    sinceBlock: 8630154,
  },
  {
    name: 'Matic Token',
    symbol: 'MATIC',
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    decimals: 18,
    sinceBlock: 7605604,
  },
  {
    name: 'MCDEX Token',
    symbol: 'MCB',
    address: '0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42',
    decimals: 18,
    sinceBlock: 10391739,
  },
  {
    name: 'Melon Token',
    symbol: 'MLN',
    address: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
    decimals: 18,
    sinceBlock: 7130380,
  },
  {
    name: 'OKB',
    symbol: 'OKB',
    address: '0x75231F58b43240C9718Dd58B4967c5114342a86c',
    decimals: 18,
    sinceBlock: 7641712,
  },
  {
    name: 'Olympus',
    symbol: 'OHM',
    address: '0x383518188C0C6d7730D91b2c03a03C837814a899',
    decimals: 9,
    sinceBlock: 12084967,
  },
  {
    name: 'OMGToken',
    symbol: 'OMG',
    address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    decimals: 18,
    sinceBlock: 3978297,
  },
  {
    name: 'Pax Dollar',
    symbol: 'USDP',
    address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
    decimals: 18,
    sinceBlock: 6294931,
  },
  {
    name: 'Pinakion',
    symbol: 'PNK',
    address: '0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d',
    decimals: 18,
    sinceBlock: 5257012,
  },
  {
    name: 'renBTC',
    symbol: 'renBTC',
    address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
    decimals: 8,
    sinceBlock: 9736969,
  },
  {
    name: 'Republic Token',
    symbol: 'REN',
    address: '0x408e41876cCCDC0F92210600ef50372656052a38',
    decimals: 18,
    sinceBlock: 4827494,
  },
  {
    name: 'SPANK',
    symbol: 'SPANK',
    address: '0x42d6622deCe394b54999Fbd73D108123806f6a18',
    decimals: 18,
    sinceBlock: 4590304,
  },
  {
    name: 'Spell Token',
    symbol: 'SPELL',
    address: '0x090185f2135308BaD17527004364eBcC2D37e5F6',
    decimals: 18,
    sinceBlock: 12454535,
  },
  {
    name: 'SushiToken',
    symbol: 'SUSHI',
    address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    decimals: 18,
    sinceBlock: 10736094,
  },
  {
    name: 'Synth sUSD',
    symbol: 'sUSD',
    address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    decimals: 18,
    sinceBlock: 8621971,
  },
  {
    name: 'Synthetix Network Token',
    symbol: 'SNX',
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    decimals: 18,
    sinceBlock: 8314597,
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    sinceBlock: 4634748,
  },
  {
    name: 'THORChain ETH.RUNE',
    symbol: 'RUNE',
    address: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
    decimals: 18,
    sinceBlock: 11644425,
  },
  {
    name: 'TrueUSD',
    symbol: 'TUSD',
    address: '0x0000000000085d4780B73119b644AE5ecd22b376',
    decimals: 18,
    sinceBlock: 6988184,
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
    sinceBlock: 10861674,
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    sinceBlock: 6082465,
  },
  {
    name: 'Wootrade Network',
    symbol: 'WOO',
    address: '0x4691937a7508860F876c9c0a2a617E7d9E945D4B',
    decimals: 18,
    sinceBlock: 11067236,
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    sinceBlock: 6766284,
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    sinceBlock: 4719568,
  },
  {
    name: 'yearn.finance',
    symbol: 'YFI',
    address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    decimals: 18,
    sinceBlock: 10475744,
  },
  {
    name: 'Zks',
    symbol: 'ZKS',
    address: '0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6',
    decimals: 18,
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
