import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ScalingProjectContractSingleAddress } from './ScalingProjectContracts'

export type ScalingProjectEscrow = OldProjectEscrow | NewProjectEscrow

interface OldProjectEscrow {
  address: EthereumAddress
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: false
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  /** If project is Layer 3 */
  isLayer3?: boolean
}

interface NewProjectEscrow {
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** All the data about the escrow contract */
  contract: Omit<ScalingProjectContractSingleAddress, 'address'>
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: true
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  /** If project is Layer 3 */
  isLayer3?: boolean
}
