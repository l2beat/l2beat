import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ScalingProjectContract } from './ScalingProjectContracts'

export type ScalingProjectEscrow = OldProjectEscrow | NewProjectEscrow

export interface AggLayerEscrow {
  type: 'AggLayer'
  nativeAsset: 'etherPreminted' | 'etherWrapped'
  wethAddress?: EthereumAddress
  /** It has to be string because frontend need to serialize it as cache key */
  premintedAmount?: string
  /** Which tokens from L1 shared bridge should be assigned to this project,
   * this is a heuristic and works only until other projects using this bridge
   * are not bridging this token. This flag was added to handle
   * non-ETH gas tokens e.g. OKB, GPT
   */
  tokensToAssignFromL1?: string[]
}

export interface ElasticChainEscrow {
  type: 'ElasticChain'
  l2BridgeAddress: EthereumAddress
  /** ERC20 address of ether on L2 */
  l2EtherAddress: EthereumAddress
  /** Which tokens from L1 shared bridge should be assigned to this project,
   * this is a heuristic and works only until other projects using this bridge
   * are not bridging this token. This flag was added to handle
   * non-ETH gas tokens e.g. OKB, GPT
   */
  tokensToAssignFromL1?: string[]
}

export type SharedEscrow = AggLayerEscrow | ElasticChainEscrow

interface OldProjectEscrow {
  address: EthereumAddress
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** List of token tickers (e.g. ETH, DAI) to exclude from tracking */
  excludedTokens?: string[]
  /** List of token tickers to track as preminted (min(circulating,lockedInEscrow)) */
  premintedTokens?: string[]
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: false
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  chain: string
  /** Inclusive */
  untilTimestamp?: UnixTime
  includeInTotal?: boolean
  source?: 'canonical' | 'external' | 'native'
  /** Bridge used for this escrow */
  bridgedUsing?: {
    bridges: {
      name: string
      /** Slug is used for the URL of the bridge on L2BEAT */
      slug?: string
    }[]
    warning?: string
  }
  sharedEscrow?: SharedEscrow
}

interface NewProjectEscrow {
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** All the data about the escrow contract */
  contract: Omit<ScalingProjectContract, 'address'>
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** List of token tickers (e.g. ETH, DAI) to exclude from tracking */
  excludedTokens?: string[]
  /** List of token tickers to track as preminted (min(circulating,lockedInEscrow)) */
  premintedTokens?: string[]
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: true
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  /** Should use name of the contract for escrow name */
  useContractName?: boolean
  chain: string
  /** Inclusive */
  untilTimestamp?: UnixTime
  includeInTotal?: boolean
  source?: 'canonical' | 'external' | 'native'
  /** Bridge used for this escrow */
  bridgedUsing?: {
    bridges: {
      name: string
      /** Slug is used for the URL of the bridge on L2BEAT */
      slug?: string
    }[]
    warning?: string
  }
  sharedEscrow?: SharedEscrow
}
