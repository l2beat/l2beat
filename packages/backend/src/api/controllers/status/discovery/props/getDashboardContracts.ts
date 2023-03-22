import {
  ContractParameters,
  EthereumAddress,
  ProjectParameters,
} from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../core/discovery/DiscoveryConfig'
import {
  DiscoveredByInfo,
  getDiscoveredBy,
} from './dashboardContracts/getDiscoveredBy'
import { getIgnoredMethods } from './dashboardContracts/getIgnoredMethods'
import { getIgnoreInWatchMode } from './dashboardContracts/getIgnoreInWatchMode'
import { getOverrides } from './dashboardContracts/getOverrides'
import { getWatched } from './dashboardContracts/getWatched'
import { getFunctions } from './utils/getFunctions'
import { getUpgradeabilityParams } from './utils/getUpgradeabilityParams'
import { DashboardContractField } from './utils/getValues'

export interface DashboardContract {
  name: string
  address: EthereumAddress
  isInitial?: boolean
  discoveredBy: DiscoveredByInfo[]
  upgradeability: DashboardContractField[]
  watched?: DashboardContractField[]
  ignoreInWatchMode?: DashboardContractField[]
  ignoreMethods?: DashboardContractField[]
  notHandled?: DashboardContractField[]
  overrides?: string[]
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
  const upgradeability = getUpgradeabilityParams(contract, discovery)

  if (contract.unverified) {
    return {
      name: contract.name,
      address: contract.address,
      isInitial,
      discoveredBy,
      upgradeability,
      isUnverified: true,
    }
  }

  const functions = getFunctions(contract, discovery.abis)

  const ignoreInWatchMode = getIgnoreInWatchMode(contract, discovery, config)

  const ignoreMethods = getIgnoredMethods(contract, config)

  const watched = getWatched(contract, discovery, ignoreInWatchMode)

  const overrides = getOverrides(contract, config)

  const rest: DashboardContractField[] = []
  for (const fn of functions) {
    if (ignoreMethods?.map((i) => i.name).includes(fn.split('(')[0])) {
      const index = ignoreMethods.map((i) => i.name).indexOf(fn.split('(')[0])
      ignoreMethods[index].name = fn
    } else if (
      ignoreInWatchMode?.map((i) => i.name).includes(fn.split('(')[0])
    ) {
      const index = ignoreInWatchMode
        .map((i) => i.name)
        .indexOf(fn.split('(')[0])
      ignoreInWatchMode[index].name = fn
    } else if (watched?.map((i) => i.name).includes(fn.split('(')[0])) {
      const index = watched.map((i) => i.name).indexOf(fn.split('(')[0])
      watched[index].name = fn
    } else {
      rest.push({ name: fn })
    }
  }

  return {
    name: contract.name,
    address: contract.address,
    upgradeability,
    ignoreInWatchMode,
    ignoreMethods,
    watched,
    notHandled: rest.length > 0 ? rest : undefined,
    overrides,
    proxyType: contract.upgradeability.type,
    isInitial,
    discoveredBy,
  }
}
