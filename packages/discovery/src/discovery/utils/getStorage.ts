import { Contract, providers } from 'ethers'

export async function getStorage(
  provider: providers.Provider,
  contract: Contract | string,
  slot: string | number,
  blockNumber: number,
): Promise<string> {
  const address = typeof contract === 'string' ? contract : contract.address
  return provider.getStorageAt(address, slot, blockNumber)
}
