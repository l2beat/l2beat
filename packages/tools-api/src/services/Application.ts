import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { createDecoderModule } from '../modules/decoder-module/createDecoderModule'
import { SignatureService } from '../modules/decoder-module/domain/SignatureService'
import { createUopsModule } from '../modules/uops-module/createUopsModule'
import { EtherscanClient } from '../third-party/EtherscanClient'
import { FourByteClient } from '../third-party/FourByteClient'
import { Sourcify4ByteClient } from '../third-party/Sourcify4ByteClient'
import { createHttpServer } from './HttpServer'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const signatureService = new SignatureService(
      new Sourcify4ByteClient(),
      new FourByteClient(),
      config.discovered,
      config.wellKnownAbi,
      logger,
    )
    const etherscanClient = new EtherscanClient(config.etherscanApiKey)

    const modules = [
      createDecoderModule(config, signatureService, etherscanClient),
      createUopsModule(config, signatureService, etherscanClient, logger),
    ]
    const httpServer = createHttpServer(config, modules, logger.for('Router'))

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')
    }
  }
}
