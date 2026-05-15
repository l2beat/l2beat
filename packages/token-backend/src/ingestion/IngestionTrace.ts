import type { AbstractTokenRecord, DeployedTokenRecord } from '@l2beat/database'
import type { DeployedTokenFacts } from '../chains/fetchDeployedTokenFacts'
import type {
  DeployedTokenPrimaryKey,
  DeployedTokenUpdateable,
} from '../schemas/DeployedToken'
import type { TokenAddress } from './InteropTransferIndex'

export interface IngestionTrace {
  address: TokenAddress
  steps: IngestionStep[]
  outcome: IngestionOutcome
}

export type AbstractTokenRef = { id: string; symbol: string }

export type IngestionStep =
  | { kind: 'invalid-address'; rawAddress: string }
  | { kind: 'existing-token'; record: DeployedTokenRecord }
  | { kind: 'no-existing-token' }
  | {
      kind: 'transfer-evidence'
      total: number
      nonSwapping: number
      abstractTokens: AbstractTokenRef[]
    }
  | { kind: 'resolved-from-transfers'; abstractToken: AbstractTokenRef }
  | { kind: 'resolved-from-existing'; abstractToken: AbstractTokenRef }
  | { kind: 'coingecko-coin-found'; coinId: string; symbol: string }
  | { kind: 'coingecko-coin-not-found' }
  | {
      kind: 'resolved-from-coingecko-existing-abstract'
      abstractToken: AbstractTokenRef
      coinId: string
    }
  | {
      kind: 'resolved-from-coingecko-new-abstract'
      coingeckoId: string
      symbol: string
    }
  | { kind: 'fetched-coingecko-abstract'; record: AbstractTokenRecord }
  | { kind: 'fetched-facts'; facts: DeployedTokenFacts }

export type IngestionOutcome =
  | { kind: 'skip'; reason: string }
  | { kind: 'conflict'; message: string }
  | { kind: 'error'; message: string }
  | { kind: 'noop'; deployedToken: DeployedTokenRecord }
  | {
      kind: 'write'
      newAbstractToken: AbstractTokenRecord | undefined
      deployedToken: DeployedTokenWrite
      neighborsToEnqueue: TokenAddress[]
    }
  | {
      kind: 'pending'
      operation: 'insert' | 'update'
      existing: DeployedTokenRecord | undefined
      abstract: PendingAbstract
      symbolFallback: string | undefined
      neighborsToEnqueue: TokenAddress[]
    }

export type PendingAbstract =
  | { kind: 'existing'; token: AbstractTokenRef }
  | { kind: 'new-coingecko'; coingeckoId: string; symbol: string }

export type DeployedTokenWrite =
  | { type: 'insert'; record: DeployedTokenRecord }
  | {
      type: 'update'
      pk: DeployedTokenPrimaryKey
      existing: DeployedTokenRecord
      update: DeployedTokenUpdateable
    }
