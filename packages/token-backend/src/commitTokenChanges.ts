import type { InteropTransferRecord, TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { Command } from './commands'
import { getLogger } from './logger'

/**
 * Evidence justifying a deployed token's abstract-token assignment. Persisted
 * as JSON on the `DeployedToken.abstractTokenAssignmentProof` column. Each
 * pipeline attaches the appropriate proof at *plan time* (so the diff shown
 * to a human or surfaced in an ingestion preview includes it); the write
 * boundary below is then a pure router that does not touch proofs.
 *
 * The non-swapping-transfer variant carries a *full* transfer rather than an
 * id because interop transfers are only retained for ~24h.
 */
export type AbstractTokenAssignmentProof =
  | { kind: 'manual'; user: string }
  | { kind: 'coingecko' }
  | {
      kind: 'non-swapping-transfer'
      transfer: AbstractTokenAssignmentProofTransfer
    }

export type AbstractTokenAssignmentProofTransfer = Omit<
  InteropTransferRecord,
  'srcRawAmount' | 'dstRawAmount'
> & {
  srcRawAmount: string | undefined
  dstRawAmount: string | undefined
}

export function nonSwappingTransferProof(
  transfer: InteropTransferRecord,
): AbstractTokenAssignmentProof {
  return {
    kind: 'non-swapping-transfer',
    transfer: {
      ...transfer,
      srcRawAmount: transfer.srcRawAmount?.toString(),
      dstRawAmount: transfer.dstRawAmount?.toString(),
    },
  }
}

export function manualProof(user: string): AbstractTokenAssignmentProof {
  return { kind: 'manual', user }
}

/**
 * The single write boundary for TokenDB. Both the user-driven
 * intent/plan/execute pipeline and the automatic ingestion pipeline funnel
 * their writes through here. Commands arrive fully populated — including any
 * `abstractTokenAssignmentProof` field — so this function is a pure router.
 */
export async function commitTokenChanges(
  tokenDb: TokenDatabase,
  commands: Command[],
): Promise<void> {
  const logger = getLogger().for('commitTokenChanges')
  for (const command of commands) {
    await executeCommand(tokenDb, command)
    logger.info('Command executed', { command })
  }
}

async function executeCommand(tokenDb: TokenDatabase, command: Command) {
  switch (command.type) {
    case 'AddAbstractTokenCommand':
      await tokenDb.abstractToken.insert(command.record)
      break
    case 'UpdateAbstractTokenCommand':
      await tokenDb.abstractToken.updateById(command.id, command.update)
      break
    case 'DeleteAbstractTokenCommand':
      await tokenDb.abstractToken.deleteById(command.id)
      break
    case 'DeleteAllAbstractTokensCommand':
      await tokenDb.abstractToken.deleteAll()
      break
    case 'AddDeployedTokenCommand':
      await tokenDb.deployedToken.insert(command.record)
      break
    case 'UpdateDeployedTokenCommand':
      await tokenDb.deployedToken.updateByChainAndAddress(
        command.pk,
        command.update,
      )
      break
    case 'DeleteDeployedTokenCommand':
      await tokenDb.deployedToken.deleteByPrimaryKey(command.pk)
      break
    case 'DeleteAllDeployedTokensCommand':
      await tokenDb.deployedToken.deleteAll()
      break
    default:
      assertUnreachable(command)
  }
}
