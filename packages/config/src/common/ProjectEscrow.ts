import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectContractSingleAddress } from './ProjectContracts'

export type ProjectEscrow = OldProjectEscrow | NewProjectEscrow

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
}

interface NewProjectEscrow {
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** All the data about the escrow contract */
  contract: Omit<ProjectContractSingleAddress, 'address'>
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: true
}
