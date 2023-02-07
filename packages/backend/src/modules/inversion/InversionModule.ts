import { Logger } from '@l2beat/common'

import { Config } from '../../config'
import { runInversion } from '../../core/inversion/runInversion'
import { ApplicationModule } from '../ApplicationModule'

export const createInversionModule = (
  config: Config,
  logger: Logger,
): ApplicationModule | undefined => {
  if (!config.invert) return
  const { file, useMermaidMarkup } = config.invert

  const start = async () => {
    logger = logger.for('InversionModule')
    logger.info('Starting')

    await runInversion(file, useMermaidMarkup)
  }

  return {
    start,
  }
}
