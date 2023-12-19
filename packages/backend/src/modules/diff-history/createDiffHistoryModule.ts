import { Logger } from '@l2beat/backend-tools'
import {
  ChainId,
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryLogger,
  HttpClient as DiscoveryHttpClient,
} from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { createDiscoveryRunner } from '../../core/discovery/createDiscoveryRunner'
import { ProjectDiscoverer } from '../../core/discovery/ProjectDiscoverer'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { DiscoveryCacheRepository } from '../../peripherals/database/DiscoveryCacheRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'

export function createDiffHistoryModule(
  config: Config,
  logger: Logger,
  database: Database,
): ApplicationModule | undefined {
  if (!config.diffHistory) {
    logger.info('DiffHistory module disabled')
    return
  }

  const configReader = new ConfigReader()

  const discoveryLogger =
    config.name === 'Backend/Local'
      ? DiscoveryLogger.SILENT
      : DiscoveryLogger.SILENT

  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

  const discoveryCacheRepository = new DiscoveryCacheRepository(
    database,
    logger,
  )

  const discoveryHttpClient = new DiscoveryHttpClient()

  const discoverers = config.diffHistory.chains
    .filter((chainConfig) => chainConfig.chainId === ChainId.ETHEREUM) // TODO(radomski): In the initial versioon we only care about ethereum
    .flatMap((chainConfig) => {
      const runner = createDiscoveryRunner(
        discoveryHttpClient,
        configReader,
        discoveryCacheRepository,
        discoveryLogger,
        chainConfig,
      )

      // Top 12 L2 projects, we are going to fetch their discoveries in order
      const projects = [
        { name: 'arbitrum', minTimestamp: new UnixTime(1622243340) },
        { name: 'optimism', minTimestamp: new UnixTime(1636665360) },
        { name: 'base', minTimestamp: new UnixTime(1686789300) },
        { name: 'zksync2', minTimestamp: new UnixTime(1676388120) },
        { name: 'dydx', minTimestamp: new UnixTime(1613991120) },
        { name: 'linea', minTimestamp: new UnixTime(1688656500) },
        { name: 'starknet', minTimestamp: new UnixTime(1637076240) },
        { name: 'loopring', minTimestamp: new UnixTime(1606370340) },
        { name: 'polygonzkevm', minTimestamp: new UnixTime(1679679000) },
        { name: 'zksync', minTimestamp: new UnixTime(1612884480) },
        { name: 'scroll', minTimestamp: new UnixTime(1696917600) },
        { name: 'aevo', minTimestamp: new UnixTime(1679196600) },
      ]

      return projects.map(
        (project) =>
          new ProjectDiscoverer(
            runner,
            project.name,
            ChainId.ETHEREUM,
            configReader,
            updateMonitorRepository,
            new Clock(project.minTimestamp, 60 * 60),
            logger,
            DISCOVERY_LOGIC_VERSION,
          ),
      )
    })

  const start = async () => {
    logger = logger.for('DiffHistoryModule')
    logger.info('Starting')

    for (const discoverer of discoverers) {
      await discoverer.start()
      await discoverer.waitUntilDiscovered()
    }
  }

  return {
    routers: [],
    start,
  }
}
