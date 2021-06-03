import { BigQuery } from '@google-cloud/bigquery'
import { providers } from 'ethers'
import { AsyncCache } from './AsyncCache'
import { BalanceChecker } from './BalanceChecker'
import { BlockInfo } from './BlockInfo'
import { getConfig } from './Config'
import { Logger } from './Logger'
import { QueryQueue } from './QueryQueue'
import { TokenBalanceChecker } from './TokenBalanceChecker'
import { TokenPriceChecker } from './TokenPriceChecker'
import { ValueLockedChecker } from './ValueLockedChecker'

export type Services = ReturnType<typeof setup>

export function setup() {
  const config = getConfig()
  const logger = new Logger()

  const bigQuery = new BigQuery()
  const queryQueue = new QueryQueue(bigQuery)
  const provider = new providers.JsonRpcProvider(config.rpcUrl, 'mainnet')
  const asyncCache = new AsyncCache()

  const blockInfo = new BlockInfo(queryQueue, provider, asyncCache)
  const balanceChecker = new BalanceChecker(provider, asyncCache)

  const tokenBalanceChecker = new TokenBalanceChecker(
    balanceChecker,
    blockInfo,
    logger
  )
  const valueLockedChecker = new ValueLockedChecker(
    blockInfo,
    tokenBalanceChecker,
    logger
  )
  const tokenPriceChecker = new TokenPriceChecker(asyncCache, logger)

  return {
    blockInfo,
    valueLockedChecker,
    tokenPriceChecker,
  }
}
