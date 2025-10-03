import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { BridgeCleaner } from './BridgeCleaner'
import { BridgeComparator } from './BridgeComparator'
import { BridgeMatcher } from './BridgeMatcher'
import { createBridgeRouter } from './BridgeRouter'
import { BridgeStore } from './BridgeStore'
import { createBridgeComparePlugins } from './compare'
import { createBridgePlugins } from './plugins'

export function createBridgeModule({
  config,
  db,
  logger,
  blockProcessors,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.bridges) {
    logger.info('Bridges module disabled')
    return
  }
  logger = logger.tag({ feature: 'bridges', module: 'bridges' })

  const plugins = createBridgePlugins()
  const bridgeStore = new BridgeStore(db)

  const processors = []
  if (config.bridges.capture.enabled) {
    for (const chain of config.bridges.capture.chains) {
      const processor = new BridgeBlockProcessor(
        chain,
        plugins,
        bridgeStore,
        logger,
      )
      blockProcessors.push(processor)
      processors.push(processor)
    }
  }

  const bridgeMatcher = new BridgeMatcher(
    bridgeStore,
    db,
    plugins,
    config.bridges.capture.chains,
    logger,
  )

  const bridgeRouter = createBridgeRouter(db, config.bridges, processors)

  const comparePlugins = createBridgeComparePlugins()

  const bridgeComparator = new BridgeComparator(db, comparePlugins, logger, {
    intervalMs: config.bridges.compare.intervalMs,
    timeoutMs: config.bridges.compare.timeoutMs,
  })

  const bridgeCleaner = new BridgeCleaner(bridgeStore, db, logger)

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    if (config.bridges && config.bridges.matching) {
      await bridgeStore.start()
      bridgeMatcher.start()
    }
    if (config.bridges && config.bridges.compare.enabled) {
      bridgeComparator.start()
    }
    if (config.bridges && config.bridges.cleaner) {
      bridgeCleaner.start()
    }
    logger.info('Started', {
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}
