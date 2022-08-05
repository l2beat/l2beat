import { BigNumber, Contract, providers, utils } from 'ethers'

import { bytes32ToAddress } from './address'

export async function getStarkWareNamedStorageAddress(
  provider: providers.Provider,
  contract: Contract | string,
  tag: string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(address, tagToSlot(tag))
  return bytes32ToAddress(value)
}

export async function getStarkWareNamedStorageUint(
  provider: providers.Provider,
  contract: Contract | string,
  tag: string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(address, tagToSlot(tag))
  return BigNumber.from(value).toString()
}

function tagToSlot(tag: string) {
  return utils.keccak256(utils.solidityPack(['string'], [tag]))
}
