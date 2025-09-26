import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { BridgeCleaner } from './BridgeCleaner'
import { BridgeMatcher } from './BridgeMatcher'
import { createBridgeRouter } from './BridgeRouter'
import { BridgeStore } from './BridgeStore'
import { createBridgePlugins } from './plugins'

export function createBridgeModule({
  config,
  db,
  logger,
  blockProcessors,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.bridges) {
    logger.info('Bridges module disabled')
    return
  }
  logger = logger.tag({ feature: 'bridges', module: 'bridges' })

  const plugins = createBridgePlugins()
  const bridgeStore = new BridgeStore(db)

  if (config.bridges.capture) {
    for (const chain of config.bridges.capture.chains) {
      const processor = new BridgeBlockProcessor(
        chain,
        plugins,
        bridgeStore,
        logger,
      )
      blockProcessors.push(processor)
    }
  }

  const bridgeMatcher = new BridgeMatcher(
    bridgeStore,
    db,
    plugins,
    config.bridges.capture.chains,
    logger,
  )

  const bridgeRouter = createBridgeRouter(db, providers, config.bridges)

  const bridgeCleaner = new BridgeCleaner(bridgeStore, db, logger)

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    if (config.bridges && config.bridges.matching) {
      await bridgeStore.start()
      bridgeMatcher.start()
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
