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

export const tokens: AssetEntry[] = [
  {
    address: 'base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    assetLogoUrl: 'https://basescan.org/token/images/centre-usdc_28.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'USDC',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
  },
  {
    address: 'base:0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    assetLogoUrl: 'https://basescan.org/token/images/wsteth3_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'wstETH',
    chainName: 'Base',
    priceUsd: 3719,
    decimals: 18,
    issuer: 'Lido',
    child: {
      address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium'
    }
  },
  {
    address: 'base:0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
    assetLogoUrl: 'https://basescan.org/token/images/wbtc_28.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'WBTC',
    chainName: 'Base',
    priceUsd: 81167,
    decimals: 8,
    issuer: 'BiT Global/BitGo',
    child: {
      address: 'eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      bridgeInfo: 'LayerZero v2 OFT (external)',
      bridgeSeverity: 'high'
    }
  },
  {
    address: 'base:0x4200000000000000000000000000000000000006',
    assetLogoUrl: 'https://basescan.org/token/images/weth_28.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'WETH',
    chainName: 'Base',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'WETH9 wrapper',
    child: {
      address: 'base:native',
      bridgeInfo: 'WETH9 wrapper',
      bridgeSeverity: 'low'
    }
  },
  {
    address: 'base:native',
    assetLogoUrl: 'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'ETH',
    chainName: 'Base',
    priceUsd: 3149,
    decimals: 18,
    issuer: 'Ethereum',
  },
  {
    address: 'base:0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    assetLogoUrl: 'https://basescan.org/token/images/daistablecoin_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'DAI',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 18,
    issuer: 'MakerDAO',
    child: {
      address: 'eth:0x6B175474E89094C44Da98b954EedeAC495271d0F',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low'
    }
  },
  {
    address: 'base:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
    assetLogoUrl: 'https://basescan.org/token/images/ethenausde_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'USDe',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 18,
    issuer: 'Ethena',
    child: {
      address: 'eth:0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
      bridgeInfo: 'LayerZero v2 OFT (external)',
      bridgeSeverity: 'high'
    }
  },
  {
    address: 'base:0x58538e6A46E07434d7E7375Bc268D3cb839C0133',
    assetLogoUrl: 'https://basescan.org/token/images/ethena_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'ENA',
    chainName: 'Base',
    priceUsd: 0.5835,
    decimals: 18,
    issuer: 'Ethena',
    child: {
      address: 'eth:0x57e114B691Db790C35207b2e685D4A43181e6061',
      bridgeInfo: 'LayerZero v2 OFT (external)',
      bridgeSeverity: 'high'
    }
  },
  {
    address: 'base:0x2416092f143378750bb29b79eD961ab195CcEea5',
    assetLogoUrl: 'https://basescan.org/token/images/ezETHv2_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'ezETH',
    chainName: 'Base',
    priceUsd: 3246,
    decimals: 18,
    issuer: 'Renzo',
    child: {
      address: 'eth:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
      bridgeInfo: 'Hyperlane, Everclear xERC-20 (external)',
      bridgeSeverity: 'high'
    }
  },
  {
    address: 'base:0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    assetLogoUrl: 'https://basescan.org/token/images/degentips_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
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
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'CORGI',
    chainName: 'Base',
    priceUsd: 0.0005365,
    decimals: 18,
    issuer: 'CORGI Coin Inc.',
  },
  {
    address: 'base:0x55027a5b06f4340cC4C82DCC74C90cA93dcb173E',
    assetLogoUrl: 'https://basescan.org/token/images/tad_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'TAD',
    chainName: 'Base',
    priceUsd: 0.001789,
    decimals: 18,
    issuer: 'All TADS Reserved',
  },
  {
    address: 'base:0x3ecced5b416e58664f04a39dD18935eB71D33B15',
    assetLogoUrl: 'https://basescan.org/token/images/brianarmbase2_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'BRIAN',
    chainName: 'Base',
    priceUsd: 0.0003774,
    decimals: 18,
    issuer: 'brianarmbase.com',
  },
  {
    address: 'base:0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    assetLogoUrl: 'https://basescan.org/token/images/aerodrome_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'AERO',
    chainName: 'Base',
    priceUsd: 1.47,
    decimals: 18,
    issuer: 'Aerodrome Finance',
  },
  {
    address: 'base:0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    assetLogoUrl: 'https://basescan.org/token/images/cbbtc_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'cbBTC',
    chainName: 'Base',
    priceUsd: 81611,
    decimals: 8,
    issuer: 'Coinbase',
  },
  {
    address: 'base:0x6985884C4392D348587B19cb9eAAf157F13271cd',
    assetLogoUrl: 'https://basescan.org/token/images/zro_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'ZRO',
    chainName: 'Base',
    priceUsd: 3.88,
    decimals: 18,
    issuer: 'LayerZero',
  },
  {
    address: 'base:0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    assetLogoUrl: 'https://basescan.org/token/images/coinbasecbeth_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'cbETH',
    chainName: 'Base',
    priceUsd: 3420,
    decimals: 18,
    issuer: 'Coinbase',
    child: {
      address: 'eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low'
    }
  },
  {
    address: 'base:0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    assetLogoUrl: 'https://basescan.org/token/images/usdbc_ofc_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'USDbC',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
    child: {
      address: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low'
    }
  },
  {
    address: 'base:0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    assetLogoUrl: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'USDT',
    chainName: 'Base',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
    child: {
      address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bridgeInfo: 'Canonical Bridge',
      bridgeSeverity: 'low'
    }
  },
  {
    address: 'arb1:0x912CE59144191C1204E64559FE8253a0e49E6548',
    assetLogoUrl: 'https://arbiscan.io/token/images/arbitrumone2_32_new.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png',
    assetName: 'ARB',
    chainName: 'Arbitrum One',
    priceUsd: 0.63,
    decimals: 18,
    issuer: 'Arbitrum Foundation / DAO',
  },
  {
    address: 'arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    assetLogoUrl: 'https://arbiscan.io/token/images/centre-usdc_28.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png',
    assetName: 'USDC',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Circle',
  },
  {
    address: 'arb1:0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    assetLogoUrl: 'https://arbiscan.io/token/images/gmxarbi_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png',
    assetName: 'GMX',
    chainName: 'Arbitrum One',
    priceUsd: 27.55,
    decimals: 18,
    issuer: 'GMX.io',
  },
  {
    address: 'arb1:0x6985884C4392D348587B19cb9eAAf157F13271cd',
    assetLogoUrl: 'https://arbiscan.io/token/images/zro_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png',
    assetName: 'GMX',
    chainName: 'Arbitrum One',
    priceUsd: 3.88,
    decimals: 18,
    issuer: 'LayerZero',
  },
  {
    address: 'arb1:0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66',
    assetLogoUrl: 'https://arbiscan.io/token/images/xaitoken_32.png?v=12',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Farbitrum.png',
    assetName: 'XAI',
    chainName: 'Arbitrum One',
    priceUsd: 0.24,
    decimals: 18,
    issuer: 'XAI.games',
  },
  {
    address: 'arb1:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    assetLogoUrl: 'https://arbiscan.io/token/images/tether_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'USDT',
    chainName: 'Arbitrum One',
    priceUsd: 1,
    decimals: 6,
    issuer: 'Tether',
    child: {
      address: 'eth:0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium'
    }
  },
  {
    address: 'arb1:0x9623063377AD1B27544C965cCd7342f7EA7e88C7',
    assetLogoUrl: 'https://arbiscan.io/token/images/TheGraph_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'GRT',
    chainName: 'Arbitrum One',
    priceUsd: 0.1829,
    decimals: 18,
    issuer: 'The Graph',
    child: {
      address: 'eth:0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium'
    }
  },
  {
    address: 'arb1:0x5979D7b546E38E414F7E9822514be443A4800529',
    assetLogoUrl: 'https://arbiscan.io/token/images/lido_32.png',
    chainLogoUrl: 'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png',
    assetName: 'wstETH',
    chainName: 'Arbitrum One',
    priceUsd: 3770,
    decimals: 18,
    issuer: 'Lido',
    child: {
      address: 'eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      bridgeInfo: 'Canonical Bridge (external escrow)',
      bridgeSeverity: 'medium'
    }
  },
]
