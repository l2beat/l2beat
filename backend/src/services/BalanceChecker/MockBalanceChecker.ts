import { projects, tokenList } from '@l2beat/config'
import { utils } from 'ethers'
import { IBalanceChecker } from './IBalanceChecker'

export class MockBalanceChecker implements IBalanceChecker {
  async getEthBalance(account: string, block: number) {
    const sinceBlock = getAddressFirstBlock(account)
    const diff = block - sinceBlock
    return utils.parseEther(diff.toString())
  }

  async getERC20Balance(tokenAddress: string, account: string, block: number) {
    const sinceBlock = getAddressFirstBlock(account)
    const diff = block - sinceBlock
    const decimals = getTokenDecimals(tokenAddress)
    return utils.parseUnits(diff.toString(), decimals)
  }
}

function getAddressFirstBlock(address: string) {
  for (const project of projects) {
    for (const bridge of project.bridges) {
      if (address === bridge.address) {
        return bridge.sinceBlock
      }
    }
  }
  throw new Error('Unknown address')
}

function getTokenDecimals(address: string) {
  for (const token of tokenList) {
    if (token.address === address) {
      return token.decimals
    }
  }
}
