import type {
  InteropTransferRecord,
  TokenDatabase,
  TokenDbHistoryEntryInsert,
} from '@l2beat/database'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import type { Command } from './commands'
import type { Intent } from './intents'

/**
 * Evidence justifying a deployed token's abstract-token assignment. Persisted
 * as JSON on the `DeployedToken.abstractTokenAssignmentProof` column. Each
 * pipeline attaches the appropriate proof at *plan time* (so the diff shown
 * to a human or surfaced in an ingestion preview includes it); the write
 * boundary below is then a pure router that does not touch proofs.
 *
 * The non-swapping-transfer variant carries a *full* transfer rather than an
 * id because interop transfers are only retained for ~7 days.
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
 * Who is making this write. Recorded in `TokenDbHistory.source` so every
 * change to TokenDB has a traceable origin. The ingestion variant carries the
 * formatted ingestion trace (`log`) so that the reasoning that produced the
 * commands is persisted on every resulting history row.
 */
export type WriteSource =
  | { kind: 'manual'; user: string; intent?: Intent }
  | { kind: 'ingestion'; log: string }

/**
 * The single write boundary for TokenDB. Both the user-driven
 * intent/plan/execute pipeline and the automatic ingestion pipeline funnel
 * their writes through here. Commands arrive fully populated — including any
 * `abstractTokenAssignmentProof` field and, for updates/deletes, the
 * `existing` record they were planned against — so this function is a pure
 * router that also stores each executed command verbatim in
 * `TokenDbHistory`.
 */
export async function commitTokenChanges(
  tokenDb: TokenDatabase,
  commands: Command[],
  source: WriteSource,
): Promise<void> {
  for (const command of commands) {
    await executeCommand(tokenDb, command)
    await tokenDb.tokenDbHistory.insert(buildHistoryEntry(source, command))
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
    default:
      assertUnreachable(command)
  }
}

function buildHistoryEntry(
  source: WriteSource,
  command: Command,
): TokenDbHistoryEntryInsert {
  return {
    timestamp: UnixTime.now(),
    source: source.kind === 'manual' ? 'manual' : 'ingestion',
    userEmail: source.kind === 'manual' ? source.user : null,
    commandType: command.type,
    command,
    intent: source.kind === 'manual' ? (source.intent ?? null) : null,
    ingestionLog: source.kind === 'ingestion' ? source.log : null,
  }
}
