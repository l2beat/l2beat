export const NetworkType = {
  Unknown: 'Unknown',
  Mainnet: 'Mainnet',
  Stage0: 'Stage0',
  Stage1: 'Stage1',
  Stage2: 'Stage2',
  'N/A': 'N/A',
} as const

export type NetworkType = (typeof NetworkType)[keyof typeof NetworkType]

export const AssetRiskEntryType = {
  Native: 'Native',
  CanonicallyBridged: 'CanonicallyBridged',
  ExternallyBridged: 'ExternallyBridged',
} as const

export type AssetRiskEntryType =
  (typeof AssetRiskEntryType)[keyof typeof AssetRiskEntryType]

export interface AssetListEntry {
  id: string
  name: string
  image: string
  type: AssetRiskEntryType
  network: {
    id: string
    name: string
    chainId: number
    image: string
    type: NetworkType
  }
  balance: bigint
  decimals: number
  value: number
  risks: string[] // TODO
}
