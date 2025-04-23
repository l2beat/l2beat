import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { createHttpServer } from './HttpServer'
import { EtherscanClient } from './api/EtherscanClient'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const httpServer = createHttpServer(config, logger.for('Router'))

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')

      const eth = new EtherscanClient(config.etherscanApiKey)
      const source = await eth.getContractInfo(
        1,
        '0xa5F565650890fBA1824Ee0F21EbBbF660a179934',
      )
      console.log(source)
    }
  }
}
