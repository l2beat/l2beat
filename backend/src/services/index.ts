import { providers } from 'ethers'
import { AsyncCache } from './AsyncCache'
import { BalanceChecker } from './BalanceChecker'
import { BlockInfo } from './BlockInfo'
import { CacheFile } from './CacheFile'
import { getConfig } from './Config'
import { Logger } from './Logger'
import { TokenBalanceChecker } from './TokenBalanceChecker'
import { TokenPriceChecker } from './TokenPriceChecker'
import { ValueLockedChecker } from './ValueLockedChecker'

export type Services = ReturnType<typeof setup>

export function setup() {
  const config = getConfig()
  const logger = new Logger()

  const provider = new providers.JsonRpcProvider(config.rpcUrl, 'mainnet')

  const cacheFile = new CacheFile()
  const asyncCache = new AsyncCache(cacheFile)

  const blockInfo = new BlockInfo(
    config.etherscanApiKey,
    provider,
    asyncCache,
    logger
  )
  const balanceChecker = new BalanceChecker(provider, asyncCache, logger)

  const tokenBalanceChecker = new TokenBalanceChecker(balanceChecker, blockInfo)
  const valueLockedChecker = new ValueLockedChecker(
    blockInfo,
    tokenBalanceChecker
  )
  const tokenPriceChecker = new TokenPriceChecker(asyncCache, logger)

  return {
    blockInfo,
    valueLockedChecker,
    tokenPriceChecker,
  }
}
