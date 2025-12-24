import type { ApplicationModule, ModuleDependencies } from '../../../types'
import { LivenessUpdater } from './LivenessUpdater'

export function createLivenessModule({
  config,
  logger,
  db,
}: ModuleDependencies):
  | (ApplicationModule & { updater: LivenessUpdater })
  | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.liveness) {
    logger.info('Liveness module disabled')
    return
  }

  logger = logger.tag({ feature: 'liveness', module: 'liveness' })

  const livenessUpdater = new LivenessUpdater(db, logger)

  return {
    updater: livenessUpdater,
  }
}
