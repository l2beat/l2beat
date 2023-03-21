import {
  ContractParameters,
  ContractValue,
  EthereumAddress,
  ProjectParameters,
  UpgradeabilityParameters,
} from '@l2beat/shared'
import { ethers } from 'ethers'
import { isArray } from 'lodash'

import { ConfigReader } from '../../../../core/discovery/ConfigReader'

export interface DashboardContractField {
  name: string
  values?: {
    value: ContractValue
    discoveryChild?: string
  }[]
}

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
  discoveredBy?: {
    address: string
    name: string
  }[]
}

export async function getDiscoveryConfig(
  project: string,
): Promise<DashboardContract[]> {
  const configReader = new ConfigReader()
  const discovery = await configReader.readDiscovery(project)
  const config = await configReader.readConfig(project)

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

function getValues(
  discovery: ProjectParameters,
  contract: ContractParameters,
  field: string,
): {
  value: ContractValue
  discoveryChild?: string
}[] {
  const value = discovery.contracts.find((c) => c.address === contract.address)
    ?.values?.[field]

  if (value === undefined) {
    return []
  }

  if (!isArray(value)) {
    return [
      {
        value: value,
        discoveryChild: getDiscoveryChild(discovery, contract, value),
      },
    ]
  }

  return value.map((v) => ({
    value: v,
    discoveryChild: getDiscoveryChild(discovery, contract, v),
  }))
}

function getFunctions(
  discovery: ProjectParameters,
  address: EthereumAddress,
): string[] {
  const contract = discovery.contracts.find((c) => c.address === address)

  if (contract === undefined) {
    throw new Error(`Contract ${address.toString()} not found`)
  }

  if (contract.values === undefined) {
    return []
  }

  const addresses = getAddresses(contract)

  const functionNames: Set<string> = new Set<string>()

  for (const address of addresses) {
    const abi = Object.entries(discovery.abis).find(
      ([a]) => a === address.toString(),
    )
    if (abi === undefined) {
      throw new Error(`ABI for ${address.toString()} not found`)
    }
    abi[1].forEach((a) => functionNames.add(a))
  }

  const iface = new ethers.utils.Interface(Array.from(functionNames))

  const functions = Object.entries(iface.functions)
    .filter(([, fn]) => fn.stateMutability === 'view')
    .map(([name]) => name)

  return functions.sort()
}

function getAddresses(contract: ContractParameters): EthereumAddress[] {
  const addresses: EthereumAddress[] = [contract.address]
  if (contract.upgradeability.type === 'immutable') {
    return addresses
  }

  if (contract.upgradeability.type === 'gnosis safe') {
    addresses.push(contract.upgradeability.masterCopy)
    return addresses
  }

  if (
    contract.upgradeability.type === 'EIP1967 proxy' ||
    contract.upgradeability.type === 'ZeppelinOS proxy' ||
    contract.upgradeability.type === 'EIP897 proxy' ||
    contract.upgradeability.type === 'call implementation proxy'
  ) {
    addresses.push(contract.upgradeability.implementation)
    return addresses
  }

  if (contract.upgradeability.type === 'StarkWare proxy') {
    addresses.push(contract.upgradeability.implementation)
    if (contract.upgradeability.callImplementation) {
      addresses.push(contract.upgradeability.callImplementation)
    }
    return addresses
  }

  if (contract.upgradeability.type === 'StarkWare diamond') {
    addresses.push(contract.upgradeability.implementation)
    addresses.push(...Object.values(contract.upgradeability.facets))
    return addresses
  }

  if (contract.upgradeability.type === 'Arbitrum proxy') {
    addresses.push(contract.upgradeability.adminImplementation)
    addresses.push(contract.upgradeability.userImplementation)
    return addresses
  }

  if (contract.upgradeability.type === 'new Arbitrum proxy') {
    addresses.push(contract.upgradeability.implementation)
    addresses.push(contract.upgradeability.adminImplementation)
    addresses.push(contract.upgradeability.userImplementation)
    return addresses
  }

  if (contract.upgradeability.type === 'resolved delegate proxy') {
    addresses.push(contract.upgradeability.implementation)
    return addresses
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (contract.upgradeability.type === 'EIP2535 diamond proxy') {
    addresses.push(...Object.values(contract.upgradeability.facets))
    return addresses
  }

  throw new Error(
    'Unhandled upgradeability type: ' + JSON.stringify(contract.upgradeability),
  )
}
function getDiscoveryChild(
  discovery: ProjectParameters,
  contract: ContractParameters,
  v: ContractValue,
): string | undefined {
  const i = discovery.contracts.find((c) => c.address.toString() === v)

  if (i === undefined || i.address.toString() === contract.address.toString()) {
    return undefined
  }

  return i.address.toString()
}
function getUpgradeability(
  upgradeability: UpgradeabilityParameters,
  discovery: ProjectParameters,
  contract: ContractParameters,
): DashboardContractField[] {
  const result: DashboardContractField[] = []

  Object.entries(upgradeability).forEach(([key, value]) => {
    if (key === 'type' || value === undefined) {
      return
    }

    if (!isArray(value)) {
      result.push({
        name: key,
        values: [
          {
            value: value.toString(),
            discoveryChild: getDiscoveryChild(discovery, contract, value),
          },
        ],
      })
    } else {
      result.push({
        name: key,
        values: value.map((v) => ({
          value: v,
          discoveryChild: getDiscoveryChild(discovery, contract, v),
        })),
      })
    }
  })

  return result
}
