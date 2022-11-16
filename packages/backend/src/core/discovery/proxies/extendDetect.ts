import { Contract, providers } from 'ethers'

import { ContractParameters } from '../types'
import { ProxyDetection, UpgradeabilityParameters } from './types'

export type DetectFunction = (
  provider: providers.Provider,
  address: string,
  blockNumber: number,
) => Promise<ProxyDetection | undefined>

export function extendDetect(detect: DetectFunction) {
  async function getUpgradeability(
    provider: providers.Provider,
    contract: Contract | string,
    blockNumber: number,
  ): Promise<UpgradeabilityParameters> {
    const address = typeof contract === 'string' ? contract : contract.address
    const detected = await detect(provider, address, blockNumber)
    if (!detected) {
      throw new Error(`Cannot get upgradeability for: ${address}!`)
    }
    return detected.upgradeability
  }

  async function getContract(
    provider: providers.Provider,
    contract: Contract | string,
    name: string,
    blockNumber: number,
  ): Promise<ContractParameters> {
    const address = typeof contract === 'string' ? contract : contract.address
    return {
      name,
      address,
      upgradeability: await getUpgradeability(provider, contract, blockNumber),
    }
  }

  return {
    detect,
    getContract,
    getUpgradeability,
  }
}
