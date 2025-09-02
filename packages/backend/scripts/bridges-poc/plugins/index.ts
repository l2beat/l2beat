import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import type { ActionDb } from '../ActionDb'
import { PortalPlugin } from './portal'
import type { Plugin } from './types'
import { WormholePlugin } from './wormhole'

export function createPlugins(
  logger: Logger,
  db: ActionDb,
  rpcs: Map<string, RpcClient>,
): Plugin[] {
  return [new WormholePlugin(logger), new PortalPlugin(logger, db, rpcs)]
}
