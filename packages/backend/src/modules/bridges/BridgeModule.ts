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
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.bridgesEnabled) {
    logger.info('Bridges module disabled')
    return
  }
  logger = logger.tag({ feature: 'bridges', module: 'bridges' })

  const plugins = createBridgePlugins(logger)
  const chains = plugins
    .flatMap((x) => x.chains)
    .filter((x, i, a) => a.indexOf(x) === i)
  const bridgeStore = new BridgeStore(db)

  for (const chain of chains) {
    const processor = new BridgeBlockProcessor(
      chain,
      plugins.filter((x) => x.chains.includes(chain)),
      bridgeStore,
      logger,
    )
    blockProcessors.push(processor)
  }

  const bridgeMatcher = new BridgeMatcher(bridgeStore, db, plugins, logger)

  const bridgeRouter = createBridgeRouter(db)

  const bridgeCleaner = new BridgeCleaner(bridgeStore, db, logger)

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    await bridgeStore.start()
    bridgeMatcher.start()
    bridgeCleaner.start()
    logger.info('Started', {
      chains: chains.length,
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}
