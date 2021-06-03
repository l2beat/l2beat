import { BigNumber, Contract, providers, utils } from 'ethers'
import { AsyncCache } from './AsyncCache'
import { AsyncQueue } from './AsyncQueue'

const abi = new utils.Interface([
  'function balanceOf(address owner) view returns (uint)',
])

export class BalanceChecker {
  private asyncQueue = new AsyncQueue({ length: 1 })

  constructor(
    private provider: providers.Provider,
    private asyncCache: AsyncCache
  ) {}

  async getEthBalance(address: string, block: number) {
    return this.asyncCache.getOrFetch(
      ['getEthBalance', address, block],
      () => this._getEthBalance(address, block),
      (big) => big.toString(),
      (json) => BigNumber.from(json)
    )
  }

  private async _getEthBalance(address: string, block: number) {
    return this.asyncQueue.enqueue(() =>
      this.provider.getBalance(address, block)
    )
  }

  async getERC20Balance(tokenAddress: string, address: string, block: number) {
    return this.asyncCache.getOrFetch(
      ['getERC20Balance', tokenAddress, address, block],
      () => this._getERC20Balance(tokenAddress, address, block),
      (big) => big.toString(),
      (json) => BigNumber.from(json)
    )
  }

  private async _getERC20Balance(
    tokenAddress: string,
    address: string,
    block: number
  ): Promise<BigNumber> {
    const contract = new Contract(tokenAddress, abi, this.provider)
    return this.asyncQueue.enqueue(() =>
      contract.balanceOf(address, { blockTag: block })
    )
  }
}
