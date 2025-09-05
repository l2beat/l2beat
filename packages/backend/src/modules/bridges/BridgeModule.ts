import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { BridgeMatcher } from './BridgeMatcher'
import { createBridgeRouter } from './BridgeRouter'
import { createBridgePlugins } from './plugins'

export function createBridgeModule({
  config,
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

  const bridgeMatcher = new BridgeMatcher(plugins, logger)
  for (const chain of chains) {
    const processor = new BridgeBlockProcessor(
      chain,
      plugins.filter((x) => x.chains.includes(chain)),
      bridgeMatcher,
      logger,
    )
    blockProcessors.push(processor)
  }

  const bridgeRouter = createBridgeRouter(bridgeMatcher)

  const start = () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    bridgeMatcher.start()
    logger.info('Started', {
      chains: chains.length,
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}
