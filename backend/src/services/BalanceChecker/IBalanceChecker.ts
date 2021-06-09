import { BigNumber } from '@ethersproject/bignumber'

export interface IBalanceChecker {
  getEthBalance(account: string, block: number): Promise<BigNumber>
  getERC20Balance(
    tokenAddress: string,
    account: string,
    block: number
  ): Promise<BigNumber>
}
