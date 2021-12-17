import { providers, utils } from 'ethers'
import { NetworkConfig } from './config'
import knownNames from './knownNames.json'

export async function getHistory(
  provider: providers.Provider,
  network: string,
  networkConfig: NetworkConfig
) {
  const hashToNameMapping = new Map<string, string>()
  for (const name of knownNames) {
    const hash = utils.solidityKeccak256(['string'], [name])
    hashToNameMapping.set(name, hash)
  }
}
