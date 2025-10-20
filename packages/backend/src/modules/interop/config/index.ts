import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { AcrossConfigPlugin } from './across'

export function createInteropConfigPlugins(
  chains: { id: number; name: string }[],
  db: Database,
  logger: Logger,
  ethereumRpc: RpcClient,
) {
  return [new AcrossConfigPlugin(chains, db, logger, ethereumRpc)]
}
