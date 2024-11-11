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
    // child: {
    //   address: 'eth:0x123123',
    //   bridgeInfo: 'Canonically bridged',
    //   bridgeSeverity: 'low'
    // }
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
]
