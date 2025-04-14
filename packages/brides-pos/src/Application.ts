import { Logger } from '@l2beat/backend-tools'
import { ChainListener } from './ChainListener'
import { createRouter } from './Router'
import { TxService } from './TxService'
import type { Config } from './config'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const txService = new TxService()

    const chainListeners = config.chains.flatMap((c) => {
      if (c.rpcUrl) {
        return new ChainListener(c, c.rpcUrl, txService, logger)
      }
      appLogger.warn(`Skipping ChainListener for ${c.name}`)
      return []
    })
    const router = createRouter(config, txService, logger.for('Router'))

    this.start = async () => {
      for (const listener of chainListeners) {
        listener.start()
      }
      await router.start()
      appLogger.info('Started')
    }
  }
}
