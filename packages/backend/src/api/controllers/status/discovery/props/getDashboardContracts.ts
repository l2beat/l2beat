import {
  ContractParameters,
  EthereumAddress,
  ProjectParameters,
} from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../core/discovery/DiscoveryConfig'
import { abiToArray } from './dashboardContracts/abiToArray'
import {
  DiscoveredByInfo,
  getDiscoveredBy,
} from './dashboardContracts/getDiscoveredBy'
import { getIgnoredMethods } from './dashboardContracts/getIgnoredMethods'
import { getIgnoreInWatchMode } from './dashboardContracts/getIgnoreInWatchMode'
import { getWatched } from './dashboardContracts/getWatched'
import { getViewABI } from './utils/getFunctions'
import { getUpgradeabilityParams } from './utils/getUpgradeabilityParams'
import { DashboardContractField } from './utils/getValues'

export interface DashboardContract {
  name: string
  derivedName?: string
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
  discovery: ProjectParameters,
  config: DiscoveryConfig,
): DashboardContract[] {
  const result = discovery.contracts.map((contract) =>
    getContract(contract, discovery, config),
  )

  return result
}

function getContract(
  contract: ContractParameters,
  discovery: ProjectParameters,
  config: DiscoveryConfig,
) {
  const isInitial = config.initialAddresses.includes(contract.address)
  const discoveredBy = getDiscoveredBy(contract, discovery, config)
  const upgradeabilityParams = getUpgradeabilityParams(contract, discovery)

  if (contract.unverified) {
    return {
      name: contract.name,
      derivedName: contract.derivedName,
      address: contract.address,
      isInitial,
      discoveredBy,
      upgradeabilityParams,
      isUnverified: true,
    }
  }

  const viewABI = getViewABI(contract, discovery.abis)

  const ignoreInWatchMode = getIgnoreInWatchMode(
    contract,
    discovery,
    config,
    viewABI,
  )
  const ignoreMethods = getIgnoredMethods(contract, config, viewABI)
  const watched = getWatched(contract, discovery, config, viewABI)
  const notHandled = getNotHandled(
    viewABI,
    ignoreInWatchMode,
    ignoreMethods,
    watched,
  )

  return {
    name: contract.name,
    derivedName: contract.derivedName,
    address: contract.address,
    upgradeabilityParams,
    ignoreInWatchMode,
    ignoreMethods,
    watched,
    notHandled,
    proxyType: contract.upgradeability.type,
    isInitial,
    discoveredBy,
  }
}

function getNotHandled(
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
    .map((name) => ({ name }))

  return notHandled
}
