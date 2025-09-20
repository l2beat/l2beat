import { Worker } from 'worker_threads'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { BridgeCleaner } from './BridgeCleaner'
import { createBridgeRouter } from './BridgeRouter'
import { BridgeStore } from './BridgeStore'
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

  for (const chain of config.bridges.chains) {
    const processor = new BridgeBlockProcessor(
      chain,
      plugins,
      bridgeStore,
      logger,
    )
    blockProcessors.push(processor)
  }

  const bridgeRouter = createBridgeRouter(db)

  const bridgeCleaner = new BridgeCleaner(bridgeStore, db, logger)

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')

    await bridgeStore.start()
    if (config.bridges && config.bridges.matchingEnabled) {
      try {
        runWorker({
          isLocal: config.isLocal,
          supportedChains: config.bridges.chains,
        })
          .then((result) => logger.info('Worker completed', result))
          .catch((error) => logger.error('Worker failed', error))
      } catch (error) {
        logger.error('Worker startup failed', error)
      }
    }
    bridgeCleaner.start()
    logger.info('Started', {
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}

function runWorker(workerData: {
  isLocal: boolean | undefined
  supportedChains: string[]
}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      './build/src/modules/bridges/runMatchingWorker.js',
      {
        workerData,
      },
    )

    worker.on('message', (result) => {
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          resolve(result)
        } else {
          reject(new Error(`Worker error: ${result.error}`))
        }
      } else {
        resolve(result)
      }
    })

    worker.on('error', (error) => {
      reject(error)
    })

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}
