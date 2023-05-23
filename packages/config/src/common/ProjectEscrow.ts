import { EthereumAddress, UnixTime } from '@l2beat/shared'

import { ProjectUpgradeability } from './ProjectContracts'

export interface ProjectEscrow {
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'

  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: true
  name?: string
  description?: string
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Details about upgradeability */
  upgradeability?: ProjectUpgradeability
}

export interface ProjectEscrowFromDiscovery {
  newVersion: true
  address: EthereumAddress
  name: string
  description?: string
  upgradeability?: ProjectUpgradeability
}
