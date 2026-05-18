import type {
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { Command } from './commands'
import { getLogger } from './logger'
import type { DeployedTokenUpdateable } from './schemas/DeployedToken'

/**
 * Identifies who triggered a TokenDB write. The write boundary uses this to
 * stamp every abstract-token assignment with the appropriate proof (`manual`
 * for user writes, the carried proof for ingestion writes).
 */
export type WriteSource =
  | { kind: 'user'; email: string }
  | { kind: 'ingestion'; proof: AbstractTokenAssignmentProof }

/**
 * Evidence justifying a deployed token's abstract-token assignment. Persisted
 * as JSON on the `DeployedToken.abstractTokenAssignmentProof` column whenever
 * an Add/Update command sets `abstractTokenId`.
 *
 * The non-swapping-transfer variant carries a *full* transfer rather than an
 * id because interop transfers are only retained for ~24h.
 */
export type AbstractTokenAssignmentProof =
  | { kind: 'manual' }
  | { kind: 'coingecko' }
  | { kind: 'non-swapping-transfer'; transfer: InteropTransferRecord }

/**
 * The single write boundary for TokenDB. Both the user-driven
 * intent/plan/execute pipeline and the automatic ingestion pipeline funnel
 * their writes through here.
 */
export async function commitTokenChanges(
  tokenDb: TokenDatabase,
  commands: Command[],
  source: WriteSource,
): Promise<void> {
  const logger = getLogger().for('commitTokenChanges')
  for (const command of commands) {
    await executeCommand(tokenDb, command, source)
    logger.info('Command executed', { command, source })
  }
}

async function executeCommand(
  tokenDb: TokenDatabase,
  command: Command,
  source: WriteSource,
) {
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
      await tokenDb.deployedToken.insert(
        stampInsertProof(command.record, source),
      )
      break
    case 'UpdateDeployedTokenCommand':
      await tokenDb.deployedToken.updateByChainAndAddress(
        command.pk,
        stampUpdateProof(command.update, command.existing, source),
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

function stampInsertProof(
  record: DeployedTokenRecord,
  source: WriteSource,
): DeployedTokenRecord {
  return {
    ...record,
    abstractTokenAssignmentProof:
      record.abstractTokenId === null ? null : proofFor(source),
  }
}

function stampUpdateProof(
  update: DeployedTokenUpdateable,
  existing: DeployedTokenRecord,
  source: WriteSource,
): DeployedTokenUpdateable {
  if (!('abstractTokenId' in update)) {
    return update
  }
  if (update.abstractTokenId === existing.abstractTokenId) {
    return update
  }
  return {
    ...update,
    abstractTokenAssignmentProof:
      update.abstractTokenId === null ? null : proofFor(source),
  }
}

function proofFor(source: WriteSource): AbstractTokenAssignmentProof {
  return source.kind === 'user' ? { kind: 'manual' } : source.proof
}
