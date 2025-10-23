import type { Logger } from '@l2beat/backend-tools'
import { TimeLoop } from '../../../../tools/TimeLoop'

export class RelayIntegration extends TimeLoop {
  constructor(
    protected logger: Logger,
    intervalMs = 10_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  override run(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
