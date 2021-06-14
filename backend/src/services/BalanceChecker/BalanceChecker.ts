import { BigNumber, utils } from 'ethers'
import { AlchemyApi } from '../../api/AlchemyApi'
import { shortenAddress } from '../../utils'
import { AsyncCache } from '../AsyncCache'
import { Logger } from '../Logger'
import { IBalanceChecker } from './IBalanceChecker'

const abi = new utils.Interface([
  'function balanceOf(address owner) view returns (uint)',
])

export class BalanceChecker implements IBalanceChecker {
  constructor(
    private alchemyApi: AlchemyApi,
    private asyncCache: AsyncCache,
    private logger: Logger
  ) {}

  async getEthBalance(account: string, block: number) {
    return this.asyncCache.getOrFetch(
      ['getEthBalance', account, block],
      () => this._getEthBalance(account, block),
      (big) => big.toString(),
      (json) => BigNumber.from(json)
    )
  }

  private async _getEthBalance(account: string, block: number) {
    const balance = await this.alchemyApi.getBalance(account, block)
    this.logger.log(
      `fetched eth balance of ${shortenAddress(account)} @ ${block}`
    )
    return balance
  }

  async getERC20Balance(tokenAddress: string, account: string, block: number) {
    return this.asyncCache.getOrFetch(
      ['getERC20Balance', tokenAddress, account, block],
      () => this._getERC20Balance(tokenAddress, account, block),
      (big) => big.toString(),
      (json) => BigNumber.from(json)
    )
  }

  private async _getERC20Balance(
    tokenAddress: string,
    account: string,
    block: number
  ): Promise<BigNumber> {
    const callData = abi.encodeFunctionData('balanceOf', [account])
    const result = await this.alchemyApi.call(tokenAddress, callData, block)
    const balance = BigNumber.from(result)
    this.logERC20Balance(tokenAddress, account, block)
    return balance
  }

  private logERC20Balance(
    tokenAddress: string,
    address: string,
    block: number
  ) {
    const t = shortenAddress(tokenAddress)
    const a = shortenAddress(address)
    this.logger.log(`fetched ${t} balance of ${a} @ ${block}`)
  }
}
