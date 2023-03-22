import { ContractParameters, EthereumAddress } from '@l2beat/shared'

export function getAddresses(contract: ContractParameters): EthereumAddress[] {
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
