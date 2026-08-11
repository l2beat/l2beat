import type { Logger } from '@l2beat/backend-tools'
import {
  type Database,
  type InteropTransferRecord,
  normalizeTokenRelation,
  type TokenDatabase,
  type TokenRelationLockedToken,
  type TokenRelationRecord,
  type TokenRelationRoute,
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
// A single run processes at most this many pages. The cursor persists after
// every page, so a backlog larger than the budget (first deploy, long outage)
// carries over to the next tick instead of monopolizing this one — token
// catalogue ingestion runs in the same tick, after relations.
const MAX_PAGES_PER_RUN = 50

/**
 * Materializes `TokenRelation` rows from interop transfers. A relation is an
 * observation: "we witnessed a non-swapping transfer between these two token
 * addresses via this plugin". It is recorded unconditionally — without
 * consulting the token catalogue or the denylist — so no interpretation
 * (token-level conflict, human ban) can ever suppress relation evidence.
 * Interpretation surfaces act instead: the relations graph drops relations
 * touching denylisted addresses, and the Relations tab marks the banned
 * endpoint. This is deliberately NOT part of the token ingestion queue.
 * See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
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
    let resolved = 0

    const setting = await this.tokenDb.tokenDbSettings.get(
      TOKEN_RELATIONS_LAST_SERIAL_ID_KEY,
    )
    let lastSerialId = setting?.value ?? '0'

    for (let page = 0; page < MAX_PAGES_PER_RUN; page++) {
      const batch = await this.db.interopTransfer.getAfterSerialId(
        lastSerialId,
        TRANSFER_BATCH_SIZE,
      )
      if (batch.latestSerialId === undefined) {
        break
      }

      const outcome = await this.ingestBatch(batch.transfers)
      inserted += outcome.inserted
      resolved += outcome.resolved
      scanned += batch.transfers.length
      lastSerialId = batch.latestSerialId
      await this.tokenDb.tokenDbSettings.set({
        key: TOKEN_RELATIONS_LAST_SERIAL_ID_KEY,
        value: lastSerialId,
      })
    }

    if (scanned === 0) {
      this.logger.debug('No new interop transfers to scan')
      return
    }

    this.logger.info('Token relation ingestion finished', {
      scannedTransfers: scanned,
      insertedRelations: inserted,
      resolvedLockedTokens: resolved,
      lastSerialId,
      durationMs: Date.now() - startedAt,
    })
  }

  private async ingestBatch(
    transfers: InteropTransferRecord[],
  ): Promise<{ inserted: number; resolved: number }> {
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
      return { inserted: 0, resolved: 0 }
    }

    const existing = await this.tokenDb.tokenRelation.getByPrimaryKeys(
      Array.from(candidates.values(), (candidate) => candidate.route),
    )
    // An existing relation whose locked endpoint was never identified is
    // upgraded as soon as an observation identifies one — possible only because
    // `lockedToken` sits outside the primary key. A known locked endpoint is
    // never overwritten.
    const resolutions: TokenRelationRecord[] = []
    for (const relation of existing) {
      const key = relationKey(relation)
      const observed = candidates.get(key)?.route.lockedToken
      candidates.delete(key)
      if (relation.lockedToken === null && observed != null) {
        resolutions.push({ ...relation, lockedToken: observed })
      }
    }
    if (candidates.size === 0 && resolutions.length === 0) {
      return { inserted: 0, resolved: 0 }
    }

    // The transfer evidence JSON is built only here, after both dedup checks
    // — in steady state almost every candidate already exists. The observed
    // burn/mint flags are deliberately not copied onto the relation: they are
    // nullable per-transfer observations (one-sided transfers often miss one)
    // and live in the `transfer` evidence JSON exactly as observed. What the
    // relation keeps is the pair-level fact they imply: `lockedToken`.
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
      for (const relation of resolutions) {
        await commitTokenChanges(
          this.tokenDb,
          [
            {
              type: 'UpdateTokenRelationCommand',
              pk: relation,
              existing: { ...relation, lockedToken: null },
              update: { lockedToken: relation.lockedToken },
            },
          ],
          { kind: 'ingestion', log: formatResolutionLog(relation) },
        )
      }
    })
    return { inserted: newRelations.length, resolved: resolutions.length }
  }
}

/**
 * The relation a transfer is evidence of, or `undefined` when the transfer is
 * not evidence of one.
 *
 * This is the single place where transfer semantics are turned into relation
 * semantics: the observed direction stays in the evidence JSON, while the pair
 * is stored in a fixed order with `lockedToken` naming the endpoint that holds
 * the locked token. Nothing downstream reads the evidence to recover roles.
 */
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
  // A token is trivially the same asset as itself, so a pair of identical
  // endpoints (same-chain transfers of one token) carries no information.
  if (
    source.chain === destination.chain &&
    source.address === destination.address
  ) {
    return undefined
  }

  return normalizeTokenRelation({
    tokenAChain: source.chain,
    tokenAAddress: source.address,
    tokenBChain: destination.chain,
    tokenBAddress: destination.address,
    plugin: transfer.plugin,
    bridgeType,
    lockedToken: lockedTokenFromTransfer(transfer, bridgeType),
  })
}

function lockedTokenFromTransfer(
  transfer: InteropTransferRecord,
  bridgeType: 'lockAndMint' | 'burnAndMint',
): TokenRelationLockedToken {
  // A burn-and-mint pair is symmetric: both sides burn and mint, so no endpoint
  // is the locked one.
  if (bridgeType === 'burnAndMint') return null

  const lockedSide = InteropTransferClassifier.inferLockedTransferSide(transfer)
  if (lockedSide === undefined) return null
  // The caller puts the transfer's source in slot A and its destination in slot
  // B, so the sides map straight onto the slots. `normalizeTokenRelation` then
  // moves this value together with the endpoints if the pair needs reordering.
  return lockedSide === 'src' ? 'A' : 'B'
}

function relationKey(relation: TokenRelationRoute): string {
  return [
    relation.tokenAChain,
    relation.tokenAAddress,
    relation.tokenBChain,
    relation.tokenBAddress,
    relation.plugin,
    relation.bridgeType,
  ].join(':')
}

function formatRelationLog(relation: TokenRelationRoute): string {
  return (
    'Observed a non-swapping interop transfer between ' +
    `${formatPair(relation)} ` +
    `via ${relation.plugin} (${relation.bridgeType}, ` +
    `locked token: ${relation.lockedToken ?? 'not identified'}) ` +
    'with no matching token relation.'
  )
}

function formatResolutionLog(relation: TokenRelationRoute): string {
  return (
    'Observed which endpoint holds the locked token of the relation between ' +
    `${formatPair(relation)} via ${relation.plugin} ` +
    `(${relation.bridgeType}): ${relation.lockedToken}.`
  )
}

function formatPair(relation: TokenRelationRoute): string {
  return (
    `${relation.tokenAChain}:${relation.tokenAAddress} and ` +
    `${relation.tokenBChain}:${relation.tokenBAddress}`
  )
}
