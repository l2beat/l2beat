import { BigQuery } from '@google-cloud/bigquery'
import { providers } from 'ethers'
import { BalanceChecker } from './BalanceChecker'
import { BlockInfo } from './BlockInfo'
import { getConfig } from './Config'

export function setup() {
  const config = getConfig()

  const bigQuery = new BigQuery()
  const blockInfo = new BlockInfo(bigQuery)

  const provider = new providers.JsonRpcProvider(config.rpcUrl)
  const balanceChecker = new BalanceChecker(provider)

  return {
    config,
    blockInfo,
    balanceChecker,
  }
}
