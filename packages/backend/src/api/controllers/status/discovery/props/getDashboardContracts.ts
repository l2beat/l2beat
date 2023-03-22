import { EthereumAddress, ProjectParameters } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../core/discovery/DiscoveryConfig'
import { getFunctions } from './utils/getFunctions'
import { getUpgradeability } from './utils/getUpgradeability'
import { DashboardContractField, getValues } from './utils/getValues'

export interface DashboardContract {
  name: string
  address: EthereumAddress
  upgradeability: DashboardContractField[]
  watched?: DashboardContractField[]
  ignoreInWatchMode?: DashboardContractField[]
  ignoreMethods?: DashboardContractField[]
  notHandled?: DashboardContractField[]
  overrides?: string[]
  isUnverified?: boolean
  proxyType?: string
  isInitial?: boolean
  discoveredBy: {
    address: string
    name: string
  }[]
}

export function getDashboardContracts(
  discovery: ProjectParameters,
  config: DiscoveryConfig,
): DashboardContract[] {
  const result = discovery.contracts.map((contract) => {
    const discoveredBy: {
      name: string
      address: string
    }[] = []
    for (const discoveredContract of discovery.contracts) {
      if (
        config.initialAddresses.includes(contract.address) ||
        contract.address === discoveredContract.address
      ) {
        continue
      }
      const discoveredFields = Object.values(discoveredContract.values ?? {})
      discoveredFields.push(Object.values(discoveredContract.upgradeability))

      if (
        JSON.stringify(discoveredFields).includes(contract.address.toString())
      ) {
        discoveredBy.push({
          address: discoveredContract.address.toString(),
          name: discoveredContract.name,
        })
      }
    }

    if (contract.unverified) {
      return {
        name: contract.name,
        address: contract.address,
        upgradeability: getUpgradeability(
          contract.upgradeability,
          discovery,
          contract,
        ),
        isUnverified: true,
        isInitial: config.initialAddresses.includes(contract.address),
        discoveredBy,
      }
    }

    let ignoreInWatchMode: DashboardContractField[] | undefined = undefined
    if (config.overrides?.[contract.address.toString()]) {
      const override = config.overrides[contract.address.toString()]
      if (override.ignoreInWatchMode) {
        ignoreInWatchMode = override.ignoreInWatchMode.map((field) => {
          return {
            name: field,
            values: getValues(discovery, contract, field),
          }
        })
      }
    }

    let ignoreMethods: DashboardContractField[] | undefined = undefined
    if (config.overrides?.[contract.address.toString()]) {
      const override = config.overrides[contract.address.toString()]
      if (override.ignoreMethods) {
        ignoreMethods = override.ignoreMethods.map((field) => {
          return {
            name: field,
          }
        })
      }
    }

    const values =
      discovery.contracts.find((c) => c.address === contract.address)?.values ??
      undefined

    let watched: DashboardContractField[] | undefined = undefined
    if (values) {
      watched = Object.keys(values)
        .filter((key) => {
          if (ignoreInWatchMode === undefined) {
            return true
          }
          return !ignoreInWatchMode.map((i) => i.name).includes(key)
        })
        .map((field) => {
          return {
            name: field,
            values: getValues(discovery, contract, field),
          }
        })
    }

    let overrides = undefined
    if (config.overrides?.[contract.address.toString()]) {
      if (config.overrides[contract.address.toString()].fields !== undefined) {
        const overridesObject =
          config.overrides[contract.address.toString()].fields
        //@ts-expect-error fix this type issue
        overrides = Object.keys(overridesObject)
      }
    }

    const functions = getFunctions(discovery, contract.address)

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
      upgradeability: getUpgradeability(
        contract.upgradeability,
        discovery,
        contract,
      ),
      ignoreInWatchMode,
      ignoreMethods,
      watched,
      notHandled: rest.length > 0 ? rest : undefined,
      overrides,
      proxyType: contract.upgradeability.type,
      isInitial: config.initialAddresses.includes(contract.address),
      discoveredBy,
    }
  })

  return result
}
