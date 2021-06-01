import { BigNumber, Contract, providers, utils } from 'ethers'

const abi = new utils.Interface([
  'function balanceOf(address owner) view returns (uint)',
])

export class BalanceChecker {
  constructor(private provider: providers.JsonRpcProvider) {}

  async getEthBalance(address: string, block: number) {
    return this.provider.getBalance(address, block)
  }

  async getERC20Balance(
    tokenAddress: string,
    address: string,
    block: number
  ): Promise<BigNumber> {
    const contract = new Contract(tokenAddress, abi, this.provider)
    return contract.balanceOf(address, { blockTag: block })
  }
}
