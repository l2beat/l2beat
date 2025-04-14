import type { Logger } from '@l2beat/backend-tools'
import type { ChainInfo } from './types'

export class ChainListener {
  constructor(
    private chain: ChainInfo,
    private rpcUrl: string,
    private logger: Logger,
  ) {
    this.logger = logger.for(this).configure({ tag: chain.name })
  }

  start() {
    this.logger.info('Started')
  }
}
