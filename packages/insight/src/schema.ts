export interface AssetEntry {
  // [eth|arb1|oeth|base]:[hex|native]
  // Example: ETH on Ethereum eth:native
  // Example: USDC on Optimism: oeth:0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85
  address: string

  assetLogoUrl: string
  chainLogoUrl: string
  assetName: string
  chainName: string
  priceUsd: number
  decimals: number

  // Who is responsible for the token. For USDC it's Circle, for WETH it's None.
  issuer: string

  tokenInfo?: string
  tokenSeverity?: 'medium' | 'high' | 'low'

  child?: {
    // backreference to AssetEntry
    address: string
    bridgeInfo: string
    bridgeSeverity: 'medium' | 'high' | 'low'
  }
}

export type ConnectedEntry = Omit<AssetEntry, 'child'> & {
  child?: {
    entry: ConnectedEntry
    address: string
    bridgeInfo: string
    bridgeSeverity: 'medium' | 'high' | 'low'
  }
}

export type TokenEntry = ConnectedEntry & {
  balanceUnits: number
  balanceUsd: number
  severity: {
    low: number
    medium: number
    high: number
  }
}

export const tokens: AssetEntry[] = [
  // ETHEREUM -------------------------------------VVV
  {
    address: 'eth:native',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'ETH',
    chainName: 'Ethereum',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Ethereum',
  },
  {
    address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/18834/large/wstETH.png?1696518295',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'wstETH',
    chainName: 'Ethereum',
    priceUsd: 3719,
    decimals: 18,
    issuer: 'Lido',
    child: {
      address: 'eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      bridgeInfo: 'stETH wrapper',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'stETH',
    chainName: 'Ethereum',
    priceUsd: 3196,
    decimals: 18,
    issuer: 'Lido',
    tokenInfo: 'governed by Lido Agent, Lido DAO and diverse node operators ',
    tokenSeverity: 'medium',
  },
  {
    address: 'eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'WBTC',
    chainName: 'Ethereum',
    priceUsd: 81167,
    decimals: 8,
    issuer: 'BiT Global/BitGo',
    tokenInfo: 'permissioned BTC custodians on Bitcoin',
    tokenSeverity: 'high',
  },
  {
    address: 'eth:0x6B175474E89094C44Da98b954EedeAC495271d0F',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/9956/large/Badge_Dai.png?1696509996',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'DAI',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 18,
    issuer: 'MakerDAO',
    tokenInfo: 'MakerDAO onchain governnance',
    tokenSeverity: 'low',
  },
  {
    address: 'eth:0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/33613/large/USDE.png?1716355685',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'USDe',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Ethena',
    tokenInfo: 'governed and backed by Ethena and permissioned custodians',
    tokenSeverity: 'high',
  },
  {
    address: 'eth:0x57e114B691Db790C35207b2e685D4A43181e6061',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/36530/large/ethena.png?1711701436',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'ENA',
    chainName: 'Ethereum',
    priceUsd: 0.5835,
    decimals: 18,
    issuer: 'Ethena',
    tokenInfo: 'Ethena governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'eth:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/34753/large/eth_renzo_logo_%281%29.png?1705956747',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'ezETH',
    chainName: 'Ethereum',
    priceUsd: 3246,
    decimals: 18,
    issuer: 'Renzo',
    tokenInfo: 'governed and staked by Renzo and permissioned stakers',
    tokenSeverity: 'high',
  },
  {
    address: 'eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/27008/large/cbeth.png?1709186989',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'cbETH',
    chainName: 'Ethereum',
    priceUsd: 3420,
    decimals: 18,
    issuer: 'Coinbase',
    tokenInfo: 'governed and backed by Coinbase',
    tokenSeverity: 'medium',
  },
  {
    address: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'USDC',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    tokenInfo: 'governed, bridged and backed by Circle',
    tokenSeverity: 'medium',
  },
  {
    address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/35001/large/logo.png?1706959346',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'USDT',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
    tokenInfo: 'governed and backed by Tether',
    tokenSeverity: 'medium',
  },
  {
    address: 'eth:0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png?1696513159',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'GRT',
    chainName: 'Ethereum',
    priceUsd: 0.1829,
    decimals: 18,
    issuer: 'The Graph',
    tokenInfo: 'TheGraph governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'eth:0x58b6A8A3302369DAEc383334672404Ee733aB239',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/7137/large/logo-circle-green.png?1696507437',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'LPT',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Livepeer',
    tokenInfo: 'Livepeer governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'eth:0x52A8845DF664D76C69d2EEa607CD793565aF42B8',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/25266/large/CxpMECpk_400x400_%281%29.png?1696524406',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'APEX',
    chainName: 'Ethereum',
    priceUsd: 1.66,
    decimals: 18,
    issuer: 'ApeX Protocol',
    tokenInfo: 'ApeX Protocol governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/33033/large/weETH.png?1701438396',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'weETH',
    chainName: 'Ethereum',
    priceUsd: 3180,
    decimals: 18,
    issuer: 'Ether.fi',
    child: {
      address: 'eth:0x35fA164735182de50811E8e2E824cFb9B6118ac2',
      bridgeInfo: 'eETH wrapper',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'eth:0x35fA164735182de50811E8e2E824cFb9B6118ac2',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/33049/large/ether.fi_eETH.png?1700473063',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'eETH',
    chainName: 'Ethereum',
    priceUsd: 3180,
    decimals: 18,
    issuer: 'Ether.fi',
    tokenInfo:
      'governed and backed by Ether.fi and permissioned restaking services',
    tokenSeverity: 'high',
  },
  {
    address: 'eth:0x808507121B80c02388fAd14726482e061B8da827',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/15069/large/Pendle_Logo_Normal-03.png?1696514728',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'PENDLE',
    chainName: 'Ethereum',
    priceUsd: 5.63,
    decimals: 18,
    issuer: 'Pendle',
    tokenInfo: 'Pendle Finance governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/18623/large/magic.png?1696518095',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'MAGIC',
    chainName: 'Ethereum',
    priceUsd: 0.41,
    decimals: 18,
    issuer: 'Treasure Technology Foundation',
    tokenInfo: 'Treasure.lol governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'arb1:0x514910771AF9Ca656af840dff83E8264EcF986CA',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    assetName: 'LINK',
    chainName: 'Arbitrum One',
    priceUsd: 14.08,
    decimals: 18,
    issuer: 'Chainlink Foundation',
    tokenInfo: 'Chainlink governance token',
    tokenSeverity: 'low',
  },
  // BASE -----------------------------------------VVV
  {
    address: 'base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'USDC',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    tokenInfo: 'governed, bridged and backed by Circle',
    tokenSeverity: 'medium',
  },
  {
    address: 'base:0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/18834/large/wstETH.png?1696518295',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'wstETH',
    chainName: 'Base',
    priceUsd: 3719,
    decimals: 18,
    issuer: 'Lido',
    child: {
      address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'base:0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'WBTC',
    chainName: 'Base',
    priceUsd: 81167,
    decimals: 8,
    issuer: 'BiT Global/BitGo',
    child: {
      address: 'eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      bridgeInfo: 'LayerZero v2 OFT (external)',
      bridgeSeverity: 'high',
    },
  },
  {
    address: 'base:0x4200000000000000000000000000000000000006',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/2518/large/weth.png?1696503332',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'WETH',
    chainName: 'Base',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'WETH9 wrapper',
    child: {
      address: 'base:native',
      bridgeInfo: 'WETH9 wrapper',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'base:native',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'ETH',
    chainName: 'Base',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Ethereum',
    child: {
      address: 'eth:native',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'base:0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/9956/large/Badge_Dai.png?1696509996',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'DAI',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 18,
    issuer: 'MakerDAO',
    child: {
      address: 'eth:0x6B175474E89094C44Da98b954EedeAC495271d0F',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'base:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/33613/large/3466ef_3c088c66c7d941e8856339d0bddf33cc_mv2.png?1702514458',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'USDe',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Ethena',
    child: {
      address: 'eth:0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
      bridgeInfo: 'LayerZero v2 OFT (external)',
      bridgeSeverity: 'high',
    },
  },
  {
    address: 'base:0x58538e6A46E07434d7E7375Bc268D3cb839C0133',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/36530/large/ethena.png?1711701436',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'ENA',
    chainName: 'Base',
    priceUsd: 0.5835,
    decimals: 18,
    issuer: 'Ethena',
    child: {
      address: 'eth:0x57e114B691Db790C35207b2e685D4A43181e6061',
      bridgeInfo: 'LayerZero v2 OFT (external)',
      bridgeSeverity: 'high',
    },
  },
  {
    address: 'base:0x2416092f143378750bb29b79eD961ab195CcEea5',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/34753/large/eth_renzo_logo_%281%29.png?1705956747',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'ezETH',
    chainName: 'Base',
    priceUsd: 3246,
    decimals: 18,
    issuer: 'Renzo',
    child: {
      address: 'eth:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
      bridgeInfo: 'Hyperlane, Everclear xERC-20 (external)',
      bridgeSeverity: 'high',
    },
  },
  {
    address: 'base:0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/34515/large/android-chrome-512x512.png?1706198225',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'DEGEN',
    chainName: 'Base',
    priceUsd: 0.0105,
    decimals: 18,
    issuer: 'degen.tips',
    tokenInfo: 'governed by Degen.tips and bridged by LayerZero',
    tokenSeverity: 'high',
  },
  {
    address: 'base:0x6223901eA64608c75Da8497d5eff15D19A1D8fd5',
    assetLogoUrl: 'https://basescan.org/token/images/corgibase_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'CORGI',
    chainName: 'Base',
    priceUsd: 0.0005365,
    decimals: 18,
    issuer: 'CORGI Coin Inc.',
    tokenInfo: 'governed by Corgi Coin Inc.',
    tokenSeverity: 'medium',
  },
  {
    address: 'base:0x55027a5b06f4340cC4C82DCC74C90cA93dcb173E',
    assetLogoUrl: 'https://basescan.org/token/images/tad_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'TAD',
    chainName: 'Base',
    priceUsd: 0.001789,
    decimals: 18,
    issuer: 'All TADS Reserved',
    tokenInfo: 'governed by All TADS Reserved',
    tokenSeverity: 'medium',
  },
  {
    address: 'base:0x3ecced5b416e58664f04a39dD18935eB71D33B15',
    assetLogoUrl: 'https://basescan.org/token/images/brianarmbase2_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'BRIAN',
    chainName: 'Base',
    priceUsd: 0.0003774,
    decimals: 18,
    issuer: 'brianarmbase.com',
    tokenInfo: 'governed by brianarmbase.com',
    tokenSeverity: 'medium',
  },
  {
    address: 'base:0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/31745/large/token.png?1696530564',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'AERO',
    chainName: 'Base',
    priceUsd: 1.47,
    decimals: 18,
    issuer: 'Aerodrome Finance',
    tokenInfo: 'Aerodrome Finance governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'base:0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/40143/large/cbbtc.webp?1726136727',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'cbBTC',
    chainName: 'Base',
    priceUsd: 81611,
    decimals: 8,
    issuer: 'Coinbase',
    tokenInfo: 'governed, bridged and backed by Coinbase',
    tokenSeverity: 'medium',
  },
  {
    address: 'base:0x6985884C4392D348587B19cb9eAAf157F13271cd',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/28206/large/ftxG9_TJ_400x400.jpeg?1696527208',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'ZRO',
    chainName: 'Base',
    priceUsd: 3.88,
    decimals: 18,
    issuer: 'LayerZero',
    tokenInfo: 'LayerZero governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'base:0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/27008/large/cbeth.png?1709186989',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'cbETH',
    chainName: 'Base',
    priceUsd: 3420,
    decimals: 18,
    issuer: 'Coinbase',
    child: {
      address: 'eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'base:0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    assetLogoUrl: 'https://basescan.org/token/images/usdbc_ofc_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'USDbC',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    child: {
      address: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'base:0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=128&q=100',
    assetName: 'USDT',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
    child: {
      address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  // ARBITRUM -----------------------------------------VVV
  {
    address: 'arb1:0x912CE59144191C1204E64559FE8253a0e49E6548',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg?1721358242',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'ARB',
    chainName: 'Arbitrum One',
    priceUsd: 0.63,
    decimals: 18,
    issuer: 'Arbitrum Foundation / DAO',
    tokenInfo: 'Arbitrum governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'USDC',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    tokenInfo: 'governed, bridged and backed by Circle',
    tokenSeverity: 'medium',
  },
  {
    address: 'arb1:0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/18323/large/arbit.png?1696517814',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'GMX',
    chainName: 'Arbitrum One',
    priceUsd: 27.55,
    decimals: 18,
    issuer: 'GMX.io',
    tokenInfo: 'GMX governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'arb1:0x6985884C4392D348587B19cb9eAAf157F13271cd',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/28206/large/ftxG9_TJ_400x400.jpeg?1696527208',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'ZRO',
    chainName: 'Arbitrum One',
    priceUsd: 3.88,
    decimals: 18,
    issuer: 'LayerZero',
    tokenInfo: 'LayerZero governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'arb1:0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/34258/large/2024-01-09_16.31.28.jpg?1704789138',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'XAI',
    chainName: 'Arbitrum One',
    priceUsd: 0.24,
    decimals: 18,
    issuer: 'XAI.games',
    tokenInfo: 'XAI governance token',
    tokenSeverity: 'medium',
  },
  {
    address: 'arb1:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/31271/large/usdt.jpeg?1696530095',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'USDT',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
    child: {
      address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'arb1:0x9623063377AD1B27544C965cCd7342f7EA7e88C7',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png?1696513159',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'GRT',
    chainName: 'Arbitrum One',
    priceUsd: 0.1829,
    decimals: 18,
    issuer: 'The Graph',
    child: {
      address: 'eth:0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'arb1:0x5979D7b546E38E414F7E9822514be443A4800529',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/18834/large/wstETH.png?1696518295',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'wstETH',
    chainName: 'Arbitrum One',
    priceUsd: 3770,
    decimals: 18,
    issuer: 'Lido',
    child: {
      address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'arb1:0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/31580/large/USDC-icon.png?1696530397',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'USDC.e',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    child: {
      address: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'arb1:0x289ba1701C2F088cf0faf8B3705246331cB8A839',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/7137/large/logo-circle-green.png?1696507437',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'LPT',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Livepeer',
    child: {
      address: 'eth:0x58b6A8A3302369DAEc383334672404Ee733aB239',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'arb1:0x2416092f143378750bb29b79eD961ab195CcEea5',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/34753/large/eth_renzo_logo_%281%29.png?1705956747',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'ezETH',
    chainName: 'Arbitrum One',
    priceUsd: 3246,
    decimals: 18,
    issuer: 'Renzo',
    child: {
      address: 'eth:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
      bridgeInfo: 'Hyperlane, Everclear xERC-20 (external)',
      bridgeSeverity: 'high',
    },
  },
  {
    address: 'arb1:native',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'ETH',
    chainName: 'Arbitrum One',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Ethereum',
    child: {
      address: 'eth:native',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    assetLogoUrl:
      'https://coin-images.coingecko.com/coins/images/2518/large/weth.png?1696503332',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'WETH',
    chainName: 'Arbitrum One',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Arbitrum WETH9 wrapper',
    child: {
      address: 'arb1:native',
      bridgeInfo: 'WETH9 wrapper',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'WBTC',
    chainName: 'Arbitrum One',
    priceUsd: 81850,
    decimals: 8,
    issuer: 'BiT Global/BitGo',
    child: {
      address: 'eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0x61A1ff55C5216b636a294A07D77C6F4Df10d3B56',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/25266/large/CxpMECpk_400x400_%281%29.png?1696524406',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'APEX',
    chainName: 'Arbitrum One',
    priceUsd: 1.66,
    decimals: 18,
    issuer: 'ApeX Protocol',
    child: {
      address: 'eth:0x52A8845DF664D76C69d2EEa607CD793565aF42B8',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/33033/large/weETH.png?1701438396',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'weETH',
    chainName: 'Arbitrum One',
    priceUsd: 3180,
    decimals: 18,
    issuer: 'Ether.fi',
    child: {
      address: 'eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/15069/large/Pendle_Logo_Normal-03.png?1696514728',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'PENDLE',
    chainName: 'Arbitrum One',
    priceUsd: 5.63,
    decimals: 18,
    issuer: 'Pendle',
    child: {
      address: 'eth:0x808507121B80c02388fAd14726482e061B8da827',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0x539bdE0d7Dbd336b79148AA742883198BBF60342',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/18623/large/magic.png?1696518095',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'MAGIC',
    chainName: 'Arbitrum One',
    priceUsd: 0.41,
    decimals: 18,
    issuer: 'Treasure Technology Foundation',
    child: {
      address: 'eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'arb1:0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=128&q=75',
    assetName: 'LINK',
    chainName: 'Arbitrum One',
    priceUsd: 14.08,
    decimals: 18,
    issuer: 'Chainlink Foundation',
    child: {
      address: 'eth:0x514910771AF9Ca656af840dff83E8264EcF986CA',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  // Optimism -------------------------------------VVV
  {
    address: 'oeth:native',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'ETH',
    chainName: 'OP Mainnet',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Ethereum',
    child: {
      address: 'eth:native',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'oeth:0x4200000000000000000000000000000000000006',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/39810/large/weth.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'WETH',
    chainName: 'OP Mainnet',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Optimism WETH9 wrapper',
    child: {
      address: 'oeth:native',
      bridgeInfo: 'WETH9 wrapper',
      bridgeSeverity: 'low',
    },
  },
  {
    address: 'oeth:0x4200000000000000000000000000000000000042',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'OP',
    chainName: 'OP Mainnet',
    priceUsd: 1.65,
    decimals: 18,
    issuer: 'Optimism Foundation / DAO',
    tokenInfo: 'Optimism governance token',
    tokenSeverity: 'low',
  },
  {
    address: 'oeth:0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'USDC',
    chainName: 'OP Mainnet',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    tokenInfo: 'governed, bridged and backed by Circle',
    tokenSeverity: 'medium',
  },
  {
    address: 'oeth:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'USDT',
    chainName: 'OP Mainnet',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
    child: {
      address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'oeth:0x1f32b1c2345538c0c6f582fcb022739c4a194ebb',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/18834/large/wstETH.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'wstETH',
    chainName: 'OP Mainnet',
    priceUsd: 3770,
    decimals: 18,
    issuer: 'Lido',
    child: {
      address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'oeth:0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/31580/large/USDC-icon.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'USDC.e',
    chainName: 'OP Mainnet',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    child: {
      address: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium',
    },
  },
  {
    address: 'oeth:0x68f180fcce6836688e9084f035309e29bf0a2095',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
    chainLogoUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    assetName: 'WBTC',
    chainName: 'OP Mainnet',
    priceUsd: 81850,
    decimals: 8,
    issuer: 'BiT Global/BitGo',
    child: {
      address: 'eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low',
    },
  },
]
