import { providers } from 'ethers'
import { AsyncCache } from './AsyncCache'
import { BalanceChecker } from './BalanceChecker/BalanceChecker'
import { MockBalanceChecker } from './BalanceChecker/MockBalanceChecker'
import { BlockInfo } from './BlockInfo/BlockInfo'
import { MockBlockInfo } from './BlockInfo/MockBlockInfo'
import { CacheFile } from './CacheFile'
import { getConfig } from './Config'
import { Logger } from './Logger'
import { TokenBalanceChecker } from './TokenBalanceChecker'
import { MockTokenPriceChecker } from './TokenPriceChecker/MockTokenPriceChecker'
import { TokenPriceChecker } from './TokenPriceChecker/TokenPriceChecker'
import { ValueLockedChecker } from './ValueLockedChecker'

export type Services = ReturnType<typeof setup>

export function setup() {
  const config = getConfig()
  const logger = new Logger()

  const provider = new providers.JsonRpcProvider(config.rpcUrl, 'mainnet')

  const cacheFile = new CacheFile()
  const asyncCache = new AsyncCache(cacheFile)

  const blockInfo = config.mock
    ? new MockBlockInfo()
    : new BlockInfo(config.etherscanApiKey, provider, asyncCache, logger)

  const balanceChecker = config.mock
    ? new MockBalanceChecker()
    : new BalanceChecker(provider, asyncCache, logger)

  const tokenBalanceChecker = new TokenBalanceChecker(balanceChecker, blockInfo)
  const valueLockedChecker = new ValueLockedChecker(
    blockInfo,
    tokenBalanceChecker
  )

  const tokenPriceChecker = config.mock
    ? new MockTokenPriceChecker()
    : new TokenPriceChecker(asyncCache, logger)

  return {
    blockInfo,
    valueLockedChecker,
    tokenPriceChecker,
  }
}
