import { providers, utils } from 'ethers'

import { Cache } from './Cache'

const nameCache = new Cache<string>('names.json')
const transactionCache = new Cache<boolean>('transactions.json')

const coder = new utils.Interface([
  'function setAddress(string name, address address)',
])

export async function getOptimismName(
  provider: providers.Provider,
  nameHash: string,
  transactionHash: string
) {
  if (!transactionCache.has(transactionHash)) {
    const tx = await provider.getTransaction(transactionHash)
    try {
      const [name] = coder.decodeFunctionData('setAddress', tx.data)
      const hash = utils.solidityKeccak256(['string'], [name])
      nameCache.set(hash, name)
    } catch {} // eslint-disable-line no-empty
    transactionCache.set(transactionHash, true)
  }
  return nameCache.get(nameHash) ?? '[Unknown]'
}
