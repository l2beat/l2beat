import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryLogger,
  HttpClient as DiscoveryHttpClient,
} from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'

import { DiffHistoryController } from '../../api/controllers/diff-history/DiffHistoryController'
import { createDiffHistoryRouter } from '../../api/routers/DiffHistoryRouter'
import { Config } from '../../config'
import { ChainConverter } from '../../core/ChainConverter'
import { Clock } from '../../core/Clock'
import { createDiscoveryRunner } from '../../core/discovery/createDiscoveryRunner'
import { ProjectDiscoverer } from '../../core/discovery/ProjectDiscoverer'
import { TaskQueue } from '../../core/queue/TaskQueue'
import { DiscoveryHistoryRepository } from '../../peripherals/database/discovery/DiscoveryHistoryRepository'
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

  const discoveryLogger = DiscoveryLogger.SILENT

  const discoveryHistoryRepository = new DiscoveryHistoryRepository(
    database,
    logger,
  )

  const discoveryCacheRepository = new DiscoveryCacheRepository(
    database,
    logger,
  )

  const discoveryHttpClient = new DiscoveryHttpClient()

  const chainConverter = new ChainConverter(config.chains)

  const discoverers = config.diffHistory.chains
    // TODO(radomski): In the initial version we only care about ethereum
    .filter((chainConfig) => chainConfig.chain === 'ethereum')
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
            'ethereum',
            configReader,
            discoveryHistoryRepository,
            new Clock(project.minTimestamp, 60 * 60),
            chainConverter,
            logger,
            DISCOVERY_LOGIC_VERSION,
          ),
      )
    })

  const controller = new DiffHistoryController(
    discoveryHistoryRepository,
    configReader,
    chainConverter,
  )
  const routers = [createDiffHistoryRouter(controller)]

  const taskQueue = new TaskQueue(
    async (discovererIndex: number) => {
      await discoverers[discovererIndex].start()
      await discoverers[discovererIndex].waitUntilDiscovered()
    },
    logger,
    {
      metricsId: 'DiffHistoryModule',
    },
  )

  const start = () => {
    logger = logger.for('DiffHistoryModule')
    logger.info('Starting')

    discoverers.forEach((_, i) => taskQueue.addToFront(i))
  }

  return {
    routers,
    start,
  }
}
