import { CoingeckoClient, HttpClient, Logger, LogLevel } from '@l2beat/common'

import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import { AlchemyApi } from './api/AlchemyApi'
import { EtherscanApi } from './api/EtherscanApi'
import { LogApi } from './api/LogApi'
import { ArbitrumStatChecker } from './ArbitrumStatChecker'
import { AsyncCache } from './AsyncCache'
import { BalanceChecker } from './balances'
import { BlockInfo } from './BlockInfo'
import { CacheFile } from './CacheFile'
import { getConfig } from './Config'
import { FlowChecker } from './FlowChecker'
import { MulticallApi } from './multicall'
import { PriceService } from './prices'
import { ProjectDates } from './ProjectDates'
import { StatCollector } from './StatCollector'

export type Services = ReturnType<typeof setup>

export function setup() {
  const config = getConfig()
  const logger = new Logger({
    logLevel: LogLevel.INFO,
    format: 'pretty',
  })

  const alchemyApi = new AlchemyApi(config.rpcUrl, logger)
  const etherscanApi = new EtherscanApi(config.etherscanApiKey, logger)

  const httpClient = new HttpClient()
  const coingeckoClient = new CoingeckoClient(httpClient, undefined)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const cacheFile = new CacheFile()
  const asyncCache = new AsyncCache(cacheFile)

  const multicallApi = new MulticallApi(alchemyApi, asyncCache, logger)
  const logApi = new LogApi(alchemyApi, logger)

  const blockInfo = new BlockInfo(alchemyApi, etherscanApi, asyncCache, logger)
  const projectDates = new ProjectDates(blockInfo)

  const balanceChecker = new BalanceChecker(multicallApi, blockInfo)
  const priceService = new PriceService(
    asyncCache,
    coingeckoQueryService,
    logger,
  )
  const flowChecker = new FlowChecker(logApi)
  const arbitrumStatChecker = new ArbitrumStatChecker(logApi)

  const statCollector = new StatCollector(
    projectDates,
    balanceChecker,
    priceService,
    flowChecker,
    arbitrumStatChecker,
  )

  return {
    statCollector,
    config,
    asyncCache,
  }
}
