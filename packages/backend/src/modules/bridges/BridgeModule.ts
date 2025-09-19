import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { BridgeCleaner } from './BridgeCleaner'
import { BridgeMatcher } from './BridgeMatcher'
import { createBridgeRouter } from './BridgeRouter'
import { BridgeStore } from './BridgeStore'
import { FinancialsService } from './financials/FinancialsService'
import { INTEROP_TOKENS } from './financials/tokens'
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

  for (const chain of config.bridges.chains) {
    const processor = new BridgeBlockProcessor(
      chain,
      plugins,
      bridgeStore,
      logger,
    )
    blockProcessors.push(processor)
  }

  const financialsService = new FinancialsService(
    INTEROP_TOKENS,
    providers.price,
  )

  const bridgeMatcher = new BridgeMatcher(
    bridgeStore,
    financialsService,
    db,
    plugins,
    config.bridges.chains,
    logger,
  )

  const bridgeRouter = createBridgeRouter(db)

  const bridgeCleaner = new BridgeCleaner(bridgeStore, db, logger)

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    await bridgeStore.start()
    if (config.bridges && config.bridges.matchingEnabled) {
      bridgeMatcher.start()
    }
    bridgeCleaner.start()
    logger.info('Started', {
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}
