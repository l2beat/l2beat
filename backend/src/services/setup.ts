import { BigQuery } from '@google-cloud/bigquery'
import { providers } from 'ethers'
import { BalanceChecker } from './BalanceChecker'
import { BlockInfo } from './BlockInfo'
import { getConfig } from './Config'
import { TokenBalanceChecker } from './TokenBalanceChecker'
import { ValueLockedChecker } from './ValueLockedChecker'

export type Services = ReturnType<typeof setup>

export function setup() {
  const config = getConfig()

  const bigQuery = new BigQuery()
  const provider = new providers.JsonRpcProvider(config.rpcUrl)

  const blockInfo = new BlockInfo(bigQuery, provider)
  const balanceChecker = new BalanceChecker(provider)

  const tokenBalanceChecker = new TokenBalanceChecker(balanceChecker, blockInfo)
  const valueLockedChecker = new ValueLockedChecker(
    blockInfo,
    tokenBalanceChecker
  )

  return {
    valueLockedChecker,
  }
}
