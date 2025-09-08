import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
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

  const plugins = createBridgePlugins()
  const chains = plugins
    .flatMap((x) => x.chains)
    .filter((x, i, a) => a.indexOf(x) === i)

  const bridgeStore = new BridgeStore(db)

  const bridgeMatcher = new BridgeMatcher(bridgeStore, db, plugins, logger)
  for (const chain of chains) {
    const processor = new BridgeBlockProcessor(
      chain,
      plugins.filter((x) => x.chains.includes(chain)),
      bridgeStore,
      logger,
    )
    blockProcessors.push(processor)
  }

  const bridgeRouter = createBridgeRouter(db)

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    await bridgeStore.start()
    bridgeMatcher.start()
    logger.info('Started', {
      chains: chains.length,
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}
