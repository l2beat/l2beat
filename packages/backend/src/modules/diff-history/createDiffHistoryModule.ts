import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryLogger,
  HttpClient as DiscoveryHttpClient,
} from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { ChainConverter } from '../../tools/ChainConverter'
import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { ApplicationModule } from '../ApplicationModule'
import { createDiscoveryRunner } from '../update-monitor/createDiscoveryRunner'
import { ProjectDiscoverer } from '../update-monitor/ProjectDiscoverer'
import { DiscoveryCacheRepository } from '../update-monitor/repositories/DiscoveryCacheRepository'
import { DiscoveryHistoryRepository } from '../update-monitor/repositories/DiscoveryHistoryRepository'
import { DiffHistoryController } from './api/DiffHistoryController'
import { createDiffHistoryRouter } from './api/DiffHistoryRouter'

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
    .filter((chainConfig) => chainConfig.name === 'ethereum')
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
        { name: 'dydx', minTimestamp: getDYDXMinTimestamp() },
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

function getDYDXMinTimestamp() {
  // TODO(radomski): The real minTimestamp is equal to 1613991120. But we have
  // to ignore some part of the dydx history because between the days of
  //
  // Jul-31-2021
  // Aug-01-2021
  // Aug-02-2021
  //
  // The following thing occurs:
  //
  // - On Jul-31-2021 the 0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC contract
  // is deployed with default configuration that sets the
  // `_EPOCH_PARAMETERS_` to
  //
  // {
  //  interval: 2419200,
  //  offset: 1628002800,
  // }
  //
  // `offset` is the timestamp of the first epoch, the value written to it at
  // construction decodes to _Aug 03 2021 15:00:00_.
  //
  // - On days Aug 01 and Aug 02 we try to call `getCurrentEpoch()` but it
  // reverst with "Epoch zero has not started" error.
  // - On Aug 03 the first epoch starts and every subsequent call does not revert.
  //
  // The big problem here is that we want to ignore the `getCurrentEpoch()`
  // function in the range Jul-31-2021 to Aug-02-2021 but we don't have
  // any tools to achieve this. It's either ignore that call completley or
  // just move the minTimestamp to the day after the first epoch starts.

  return new UnixTime(1628002800)
}
