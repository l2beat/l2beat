import type { DiscoveryConfig } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { ethers } from 'ethers'

import { abiToArray } from './dashboardContracts/abiToArray'
import { getDescription } from './dashboardContracts/getDescription'
import {
  type DiscoveredByInfo,
  getDiscoveredBy,
} from './dashboardContracts/getDiscoveredBy'
import { getIgnoreInWatchMode } from './dashboardContracts/getIgnoreInWatchMode'
import { getIgnoredMethods } from './dashboardContracts/getIgnoredMethods'
import { getWatched } from './dashboardContracts/getWatched'
import { getViewABI } from './utils/getFunctions'
import { getUpgradeabilityParams } from './utils/getUpgradeabilityParams'
import type { DashboardContractField } from './utils/getValues'

export interface DashboardContract {
  name: string
  derivedName?: string
  description?: string
  address: EthereumAddress
  isInitial?: boolean
  discoveredBy: DiscoveredByInfo[]
  upgradeabilityParams: DashboardContractField[]
  watched?: DashboardContractField[]
  ignoreInWatchMode?: DashboardContractField[]
  ignoreMethods?: DashboardContractField[]
  notHandled?: DashboardContractField[]
  isUnverified?: boolean
  proxyType?: string
}

export function getDashboardContracts(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
): DashboardContract[] {
  const result = discovery.contracts.map((contract) =>
    getContract(discovery, config, contract),
  )

  return result
}

function getContract(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  contract: ContractParameters,
) {
  const isInitial = config.initialAddresses.includes(contract.address)
  const discoveredBy = getDiscoveredBy(discovery, config, contract)
  const upgradeabilityParams = getUpgradeabilityParams(discovery, contract)
  const description = config.for(contract.address).description

  if (contract.unverified) {
    return {
      name: contract.name,
      description,
      derivedName: contract.derivedName,
      address: contract.address,
      isInitial,
      discoveredBy,
      upgradeabilityParams,
      isUnverified: true,
    }
  }

  const viewABI = getViewABI(
    contract,
    discovery.abis,
    discovery.eoas.map((e) => e.address),
  )

  const ignoreInWatchMode = getIgnoreInWatchMode(
    discovery,
    config,
    contract,
    viewABI,
  )
  const ignoreMethods = getIgnoredMethods(config, contract, viewABI)
  const watched = getWatched(discovery, config, contract, viewABI)
  const notHandled = getNotHandled(
    config,
    contract.address,
    viewABI,
    ignoreInWatchMode,
    ignoreMethods,
    watched,
  )

  return {
    name: contract.name,
    description,
    derivedName: contract.derivedName,
    address: contract.address,
    upgradeabilityParams,
    ignoreInWatchMode,
    ignoreMethods,
    watched,
    notHandled,
    proxyType: contract.proxyType,
    isInitial,
    discoveredBy,
  }
}

function getNotHandled(
  config: DiscoveryConfig,
  address: EthereumAddress,
  viewABI: ethers.utils.Interface,
  ignoreInWatchMode: DashboardContractField[] | undefined,
  ignoreMethods: DashboardContractField[] | undefined,
  watched: DashboardContractField[] | undefined,
): DashboardContractField[] | undefined {
  const handled = (ignoreInWatchMode ?? [])
    .map((field) => field.name)
    .concat((ignoreMethods ?? []).map((field) => field.name))
    .concat((watched ?? []).map((field) => field.name))

  const notHandled = abiToArray(viewABI)
    .filter((field) => !handled.includes(field))
    .map((name) => ({
      name,
      description: getDescription(config, address, name),
    }))

  return notHandled
}
