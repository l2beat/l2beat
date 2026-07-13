import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropTransferRecord,
  TokenDatabase,
  TokenRelationRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { InteropTransferClassifier } from '../../../shared/build'
import {
  commitTokenChanges,
  serializeInteropTransferRecord,
} from '../commitTokenChanges'
import { normalizeTransferSide } from './tokenIngestionUtils'

const TOKEN_RELATIONS_LAST_SERIAL_ID_KEY = 'token-relations:lastSerialId'
// Transfers are read in fixed-size pages. Loading all retained transfers at
// once (~7 days) has caused out-of-memory crashes before — do not remove the
// paging.
const TRANSFER_BATCH_SIZE = 2_000

/**
 * Materializes `TokenRelation` rows from interop transfers. A relation is an
 * observation: "we witnessed a non-swapping transfer between these two token
 * addresses via this plugin". It is recorded unconditionally — without
 * consulting the token catalogue — so a token-level conflict can never
 * suppress relation evidence. This is deliberately NOT part of the token
 * ingestion queue. See
 * docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
 */
export class TokenRelationIngestion {
  constructor(
    private readonly db: Database,
    private readonly tokenDb: TokenDatabase,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async runOnce() {
    const startedAt = Date.now()
    let scanned = 0
    let inserted = 0

    const setting = await this.tokenDb.tokenDbSettings.get(
      TOKEN_RELATIONS_LAST_SERIAL_ID_KEY,
    )
    let lastSerialId = setting?.value ?? '0'

    while (true) {
      const batch = await this.db.interopTransfer.getAfterSerialId(
        lastSerialId,
        TRANSFER_BATCH_SIZE,
      )
      if (batch.latestSerialId === undefined) {
        break
      }

      inserted += await this.ingestBatch(batch.transfers)
      scanned += batch.transfers.length
      lastSerialId = batch.latestSerialId
      await this.tokenDb.tokenDbSettings.set({
        key: TOKEN_RELATIONS_LAST_SERIAL_ID_KEY,
        value: lastSerialId,
      })
    }

    if (scanned === 0) {
      this.logger.debug('No new interop transfers found')
      return
    }

    this.logger.info('Token relation ingestion finished', {
      scannedTransfers: scanned,
      insertedRelations: inserted,
      lastSerialId,
      durationMs: Date.now() - startedAt,
    })
  }

  private async ingestBatch(
    transfers: InteropTransferRecord[],
  ): Promise<number> {
    const candidates = new Map<
      string,
      { route: TokenRelationRoute; transfer: InteropTransferRecord }
    >()
    for (const transfer of transfers) {
      const route = tokenRouteFromTransfer(transfer)
      if (route && !candidates.has(relationKey(route))) {
        candidates.set(relationKey(route), { route, transfer })
      }
    }
    if (candidates.size === 0) {
      return 0
    }

    const existing = await this.tokenDb.tokenRelation.getByPrimaryKeys(
      Array.from(candidates.values(), (candidate) => candidate.route),
    )
    for (const relation of existing) {
      candidates.delete(relationKey(relation))
    }
    if (candidates.size === 0) {
      return 0
    }

    // The transfer evidence JSON is built only here, after both dedup checks
    // — in steady state almost every candidate already exists. The observed
    // burn/mint flags are deliberately not copied onto the relation: they are
    // nullable observations (one-sided transfers often miss one) and live in
    // the `transfer` evidence JSON exactly as observed.
    const newRelations = Array.from(
      candidates.values(),
      ({ route, transfer }): TokenRelationRecord => ({
        ...route,
        transfer: JSON.parse(
          JSON.stringify(serializeInteropTransferRecord(transfer)),
        ),
      }),
    )
    await this.tokenDb.transaction(async () => {
      for (const relation of newRelations) {
        await commitTokenChanges(
          this.tokenDb,
          [{ type: 'AddTokenRelationCommand', record: relation }],
          { kind: 'ingestion', log: formatRelationLog(relation) },
        )
      }
    })
    return newRelations.length
  }
}

function tokenRouteFromTransfer(
  transfer: InteropTransferRecord,
): TokenRelationRoute | undefined {
  const bridgeType =
    transfer.bridgeType ?? InteropTransferClassifier.inferBridgeType(transfer)
  if (bridgeType !== 'lockAndMint' && bridgeType !== 'burnAndMint') {
    return undefined
  }

  const source = normalizeTransferSide(
    transfer.srcChain,
    transfer.srcTokenAddress,
  )
  const destination = normalizeTransferSide(
    transfer.dstChain,
    transfer.dstTokenAddress,
  )
  if (!source || !destination) {
    return undefined
  }

  return {
    tokenFromChain: source.chain,
    tokenFromAddress: source.address,
    tokenToChain: destination.chain,
    tokenToAddress: destination.address,
    plugin: transfer.plugin,
    bridgeType,
  }
}

function relationKey(relation: TokenRelationRoute): string {
  return [
    relation.tokenFromChain,
    relation.tokenFromAddress.toLowerCase(),
    relation.tokenToChain,
    relation.tokenToAddress.toLowerCase(),
    relation.plugin,
    relation.bridgeType,
  ].join(':')
}

function formatRelationLog(relation: TokenRelationRoute): string {
  return (
    'Observed a non-swapping interop transfer ' +
    `${relation.tokenFromChain}:${relation.tokenFromAddress} -> ` +
    `${relation.tokenToChain}:${relation.tokenToAddress} ` +
    `via ${relation.plugin} (${relation.bridgeType}) ` +
    'with no matching token relation.'
  )
}
