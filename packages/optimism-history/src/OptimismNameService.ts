import { Cache } from '@l2beat/common'
import { providers, utils } from 'ethers'

const coder = new utils.Interface([
  'function setAddress(string name, address address)',
])

export class OptimismNameService {
  constructor(private provider: providers.Provider, private cache: Cache) {}

  async getOptimismName(nameHash: string, transactionHash: string) {
    if (!this.cache.has('transactions', transactionHash)) {
      const tx = await this.provider.getTransaction(transactionHash)
      try {
        const [name] = coder.decodeFunctionData('setAddress', tx.data)
        const hash = utils.solidityKeccak256(['string'], [name])
        this.cache.set('names', hash, name)
      } catch {} // eslint-disable-line no-empty
      this.cache.set('transactions', transactionHash, true)
    }
    return (this.cache.get('names', nameHash) as string) ?? '[Unknown]'
  }
}
