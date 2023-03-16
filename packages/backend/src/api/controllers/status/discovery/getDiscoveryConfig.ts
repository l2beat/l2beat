import {
  ContractParameters,
  EthereumAddress,
  ProjectParameters,
} from '@l2beat/shared'
import { ethers } from 'ethers'

import { ConfigReader } from '../../../../core/discovery/ConfigReader'

interface Field {
  name: string
  value?: string
}

export interface ContractConfig {
  name: string
  addresses: EthereumAddress[]
  watched?: Field[]
  ignoreInWatchMode?: Field[]
  ignoreMethods?: string[]
  rest?: string[]
  overrides?: string[]
  isUnverified?: boolean
  proxyType?: string
}

export async function getDiscoveryConfig(
  project: string,
): Promise<ContractConfig[]> {
  const configReader = new ConfigReader()
  const discovery = await configReader.readDiscovery(project)
  const config = await configReader.readConfig(project)

  const result = discovery.contracts.map((contract) => {
    if (contract.unverified) {
      return {
        name: contract.name,
        addresses: [contract.address],
        isUnverified: true,
      }
    }

    let ignoreInWatchMode: Field[] | undefined = undefined
    if (config.overrides?.[contract.address.toString()]) {
      const override = config.overrides[contract.address.toString()]
      if (override.ignoreInWatchMode) {
        ignoreInWatchMode = override.ignoreInWatchMode.map((field) => {
          return {
            name: field,
            value: discovery.contracts
              .find((c) => c.address === contract.address)
              ?.values?.[field].toString(),
          }
        })
      }
    }

    let ignoreMethods: string[] | undefined = undefined
    if (config.overrides?.[contract.address.toString()]) {
      const override = config.overrides[contract.address.toString()]
      if (override.ignoreMethods) {
        ignoreMethods = override.ignoreMethods
      }
    }

    const values =
      discovery.contracts.find((c) => c.address === contract.address)?.values ??
      undefined

    let watched: Field[] | undefined = undefined
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
            value: discovery.contracts
              .find((c) => c.address === contract.address)
              ?.values?.[field].toString(),
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

    const rest = []
    for (const fn of functions) {
      if (ignoreMethods?.includes(fn.split('(')[0])) {
        const index = ignoreMethods.indexOf(fn.split('(')[0])
        ignoreMethods[index] = fn
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
        rest.push(fn)
      }
    }

    return {
      name: contract.name,
      addresses: getAddresses(contract),
      ignoreInWatchMode,
      ignoreMethods,
      watched,
      rest,
      overrides,
      proxyType: contract.upgradeability.type,
    }
  })

  return result
}

function getFunctions(
  discovery: ProjectParameters,
  address: EthereumAddress,
): string[] {
  const contract = discovery.contracts.find((c) => c.address === address)

  if (contract === undefined) {
    throw new Error(`Contract ${address.toString()} not found`)
  }

  const addresses = getAddresses(contract)

  const functionNames: string[] | undefined = []

  for (const address of addresses) {
    const abi = Object.entries(discovery.abis).find(
      ([a]) => a === address.toString(),
    )
    if (abi === undefined) {
      throw new Error(`ABI for ${address.toString()} not found`)
    }
    functionNames.push(...abi[1])
  }

  const iface = new ethers.utils.Interface(functionNames)

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
