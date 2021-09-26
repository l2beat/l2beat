import { Logger, LogLevel } from '../../services/Logger'
import { AlchemyApi } from './api/AlchemyApi'
import { EtherscanApi } from './api/EtherscanApi'
import { LogApi } from './api/LogApi'
import { ArbitrumStatChecker } from './ArbitrumStatChecker'
import { AsyncCache } from './AsyncCache'
import { BalanceChecker } from './balances'
import { BlockInfo } from './BlockInfo'
import { CacheFile } from './CacheFile'
import { getConfig } from './Config'
import { ExchangeAddresses } from './ExchangeAddresses'
import { FlowChecker } from './FlowChecker'
import { MulticallApi } from './multicall'
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

  const cacheFile = new CacheFile()
  const asyncCache = new AsyncCache(cacheFile)

  const multicallApi = new MulticallApi(alchemyApi, asyncCache, logger)
  const logApi = new LogApi(alchemyApi, logger)

  const exchangeAddresses = new ExchangeAddresses(multicallApi)

  const blockInfo = new BlockInfo(alchemyApi, etherscanApi, asyncCache, logger)
  const projectDates = new ProjectDates(blockInfo)

  const balanceChecker = new BalanceChecker(multicallApi, blockInfo)
  const flowChecker = new FlowChecker(logApi)
  const arbitrumStatChecker = new ArbitrumStatChecker(logApi)

  const statCollector = new StatCollector(
    exchangeAddresses,
    projectDates,
    balanceChecker,
    flowChecker,
    arbitrumStatChecker
  )

  return {
    statCollector,
    config,
    asyncCache,
  }
}
