import { AlchemyApi } from './api/AlchemyApi'
import { EtherscanApi } from './api/EtherscanApi'
import { AsyncCache } from './AsyncCache'
import { BlockInfo } from './BlockInfo'
import { CacheFile } from './CacheFile'
import { getConfig } from './Config'
import { ProjectDates } from './ProjectDates'
import { ExchangeAddresses } from './ExchangeAddresses'
import { Logger } from './Logger'
import { MulticallApi } from './multicall'
import { BalanceAnalyzer } from './balances'
import { BalanceCollector } from './BalanceCollector'

export type Services = ReturnType<typeof setup>

export function setup() {
  const config = getConfig()
  const logger = new Logger()

  const alchemyApi = new AlchemyApi(config.rpcUrl, logger)
  const etherscanApi = new EtherscanApi(config.etherscanApiKey, logger)

  const cacheFile = new CacheFile()
  const asyncCache = new AsyncCache(cacheFile)

  const multicallApi = new MulticallApi(alchemyApi, asyncCache, logger)

  const exchangeAddresses = new ExchangeAddresses(multicallApi)

  const blockInfo = new BlockInfo(alchemyApi, etherscanApi, asyncCache, logger)
  const projectDates = new ProjectDates(blockInfo)

  const balanceAnalyzer = new BalanceAnalyzer(multicallApi, blockInfo)

  const balanceCollector = new BalanceCollector(
    exchangeAddresses,
    projectDates,
    balanceAnalyzer
  )

  return {
    balanceCollector,
    config,
    asyncCache,
  }
}
