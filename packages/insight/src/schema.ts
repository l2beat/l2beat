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
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'ETH',
    chainName: 'Ethereum',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Ethereum',
  },
  {
    address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    assetLogoUrl: 'https://basescan.org/token/images/wsteth3_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
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
    assetLogoUrl: 'https://basescan.org/token/images/wsteth3_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'stETH',
    chainName: 'Ethereum',
    priceUsd: 3196,
    decimals: 18,
    issuer: 'Lido',
  },
  {
    address: 'eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    assetLogoUrl: 'https://basescan.org/token/images/wbtc_28.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'WBTC',
    chainName: 'Ethereum',
    priceUsd: 81167,
    decimals: 8,
    issuer: 'BiT Global/BitGo',
  },
  {
    address: 'eth:0x6B175474E89094C44Da98b954EedeAC495271d0F',
    assetLogoUrl: 'https://basescan.org/token/images/daistablecoin_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'DAI',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 18,
    issuer: 'MakerDAO',
  },
  {
    address: 'eth:0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
    assetLogoUrl: 'https://basescan.org/token/images/ethenausde_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'USDe',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Ethena',
  },
  {
    address: 'eth:0x57e114B691Db790C35207b2e685D4A43181e6061',
    assetLogoUrl: 'https://basescan.org/token/images/ethena_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'ENA',
    chainName: 'Ethereum',
    priceUsd: 0.5835,
    decimals: 18,
    issuer: 'Ethena',
  },
  {
    address: 'eth:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    assetLogoUrl: 'https://basescan.org/token/images/ezETHv2_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'ezETH',
    chainName: 'Ethereum',
    priceUsd: 3246,
    decimals: 18,
    issuer: 'Renzo',
  },
  {
    address: 'eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
    assetLogoUrl: 'https://basescan.org/token/images/coinbasecbeth_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'cbETH',
    chainName: 'Ethereum',
    priceUsd: 3420,
    decimals: 18,
    issuer: 'Coinbase',
  },
  {
    address: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    assetLogoUrl: 'https://etherscan.io/token/images/centre-usdc_28.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'USDC',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
  },
  {
    address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
    assetLogoUrl:
      'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'USDT',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
  },
  {
    address: 'eth:0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    assetLogoUrl: 'https://arbiscan.io/token/images/TheGraph_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'GRT',
    chainName: 'Ethereum',
    priceUsd: 0.1829,
    decimals: 18,
    issuer: 'The Graph',
  },
  {
    address: 'eth:0x58b6A8A3302369DAEc383334672404Ee733aB239',
    assetLogoUrl: 'https://arbiscan.io/token/images/livepeer_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'LPT',
    chainName: 'Ethereum',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Livepeer',
  },
  {
    address: 'eth:0x52A8845DF664D76C69d2EEa607CD793565aF42B8',
    assetLogoUrl: 'https://arbiscan.io/token/images/apexprotocol_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'APEX',
    chainName: 'Ethereum',
    priceUsd: 1.66,
    decimals: 18,
    issuer: 'ApeX Protocol',
  },
  {
    address: 'eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    assetLogoUrl: 'https://arbiscan.io/token/images/etherfiweeth_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/etherfiweeth_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'eETH',
    chainName: 'Ethereum',
    priceUsd: 3180,
    decimals: 18,
    issuer: 'Ether.fi',
  },
  {
    address: 'eth:0x808507121B80c02388fAd14726482e061B8da827',
    assetLogoUrl: 'https://arbiscan.io/token/images/pendlefin_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'PENDLE',
    chainName: 'Ethereum',
    priceUsd: 5.63,
    decimals: 18,
    issuer: 'Pendle',
  },
  {
    address: 'eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A',
    assetLogoUrl: 'https://arbiscan.io/token/images/magicv2_32.png',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'MAGIC',
    chainName: 'Ethereum',
    priceUsd: 0.41,
    decimals: 18,
    issuer: 'Treasure Technology Foundation',
  },
  {
    address: 'arb1:0x514910771AF9Ca656af840dff83E8264EcF986CA',
    assetLogoUrl: 'https://arbiscan.io/token/images/chainlink_32.png?v=1',
    chainLogoUrl:
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    assetName: 'LINK',
    chainName: 'Arbitrum One',
    priceUsd: 14.08,
    decimals: 18,
    issuer: 'Chainlink Foundation',
  },
  // BASE -----------------------------------------VVV
  {
    address: 'base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    assetLogoUrl: 'https://basescan.org/token/images/centre-usdc_28.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'USDC',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
  },
  {
    address: 'base:0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    assetLogoUrl: 'https://basescan.org/token/images/wsteth3_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/wbtc_28.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/weth_28.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/daistablecoin_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/ethenausde_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/ethena_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/ezETHv2_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://basescan.org/token/images/degentips_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'DEGEN',
    chainName: 'Base',
    priceUsd: 0.0105,
    decimals: 18,
    issuer: 'degen.tips',
    // child: {
    //   address: 'eth:0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    //   bridgeInfo: 'LayerZero v2 OFT (external)',
    //   bridgeSeverity: 'high'
    // }
  },
  {
    address: 'base:0x6223901eA64608c75Da8497d5eff15D19A1D8fd5',
    assetLogoUrl: 'https://basescan.org/token/images/corgibase_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'CORGI',
    chainName: 'Base',
    priceUsd: 0.0005365,
    decimals: 18,
    issuer: 'CORGI Coin Inc.',
  },
  {
    address: 'base:0x55027a5b06f4340cC4C82DCC74C90cA93dcb173E',
    assetLogoUrl: 'https://basescan.org/token/images/tad_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'TAD',
    chainName: 'Base',
    priceUsd: 0.001789,
    decimals: 18,
    issuer: 'All TADS Reserved',
  },
  {
    address: 'base:0x3ecced5b416e58664f04a39dD18935eB71D33B15',
    assetLogoUrl: 'https://basescan.org/token/images/brianarmbase2_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'BRIAN',
    chainName: 'Base',
    priceUsd: 0.0003774,
    decimals: 18,
    issuer: 'brianarmbase.com',
  },
  {
    address: 'base:0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    assetLogoUrl: 'https://basescan.org/token/images/aerodrome_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'AERO',
    chainName: 'Base',
    priceUsd: 1.47,
    decimals: 18,
    issuer: 'Aerodrome Finance',
  },
  {
    address: 'base:0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    assetLogoUrl: 'https://basescan.org/token/images/cbbtc_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'cbBTC',
    chainName: 'Base',
    priceUsd: 81611,
    decimals: 8,
    issuer: 'Coinbase',
  },
  {
    address: 'base:0x6985884C4392D348587B19cb9eAAf157F13271cd',
    assetLogoUrl: 'https://basescan.org/token/images/zro_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
    assetName: 'ZRO',
    chainName: 'Base',
    priceUsd: 3.88,
    decimals: 18,
    issuer: 'LayerZero',
  },
  {
    address: 'base:0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    assetLogoUrl: 'https://basescan.org/token/images/coinbasecbeth_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
      'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=96&q=75',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/arbitrumone2_32_new.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'ARB',
    chainName: 'Arbitrum One',
    priceUsd: 0.63,
    decimals: 18,
    issuer: 'Arbitrum Foundation / DAO',
  },
  {
    address: 'arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    assetLogoUrl: 'https://arbiscan.io/token/images/centre-usdc_28.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'USDC',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
  },
  {
    address: 'arb1:0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    assetLogoUrl: 'https://arbiscan.io/token/images/gmxarbi_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'GMX',
    chainName: 'Arbitrum One',
    priceUsd: 27.55,
    decimals: 18,
    issuer: 'GMX.io',
  },
  {
    address: 'arb1:0x6985884C4392D348587B19cb9eAAf157F13271cd',
    assetLogoUrl: 'https://arbiscan.io/token/images/zro_32.png',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'ZRO',
    chainName: 'Arbitrum One',
    priceUsd: 3.88,
    decimals: 18,
    issuer: 'LayerZero',
  },
  {
    address: 'arb1:0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66',
    assetLogoUrl: 'https://arbiscan.io/token/images/xaitoken_32.png?v=12',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
    assetName: 'XAI',
    chainName: 'Arbitrum One',
    priceUsd: 0.24,
    decimals: 18,
    issuer: 'XAI.games',
  },
  {
    address: 'arb1:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    assetLogoUrl: 'https://arbiscan.io/token/images/tether_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/TheGraph_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/lido_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/centre-usdc_28.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/livepeer_32.png',
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
    assetLogoUrl: 'https://basescan.org/token/images/ezETHv2_32.png',
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
      'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
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
    assetLogoUrl: 'https://basescan.org/token/images/weth_28.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/wbtc_28.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/apexprotocol_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/etherfiweeth_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/pendlefin_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/magicv2_32.png',
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
    assetLogoUrl: 'https://arbiscan.io/token/images/chainlink_32.png?v=1',
    chainLogoUrl:
      'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png&w=96&q=75',
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
]
