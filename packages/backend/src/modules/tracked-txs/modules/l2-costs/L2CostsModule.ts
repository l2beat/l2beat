import { assert } from '@l2beat/shared-pure'
import type { ApplicationModule, ModuleDependencies } from '../../../types'
import { L2CostsUpdater } from './L2CostsUpdater'

export function createL2CostsModule({
  config,
  logger,
  peripherals,
  providers,
}: ModuleDependencies):
  | (ApplicationModule & { updater: L2CostsUpdater })
  | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.l2costs) {
    logger.info('L2Costs module disabled')
    return
  }

  logger = logger.tag({ feature: 'costs', module: 'costs' })

  const ethereumRpcClient = providers.clients.rpcClients.find(
    (c) => c.chain === 'ethereum',
  )
  assert(ethereumRpcClient, 'Ethereum RPC client is required')
  const l2CostsUpdater = new L2CostsUpdater(
    peripherals.database,
    logger,
    ethereumRpcClient,
  )

  return {
    updater: l2CostsUpdater,
  }
}
