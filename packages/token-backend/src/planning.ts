import {
  type DeployedTokenRecord,
  type JsonValue,
  normalizeTokenRelation,
  type TokenDatabase,
} from '@l2beat/database'
import { assertUnreachable, MANUAL_RELATION_PLUGIN } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { Command } from './commands'
import { manualProof } from './commitTokenChanges'
import {
  type AddAbstractTokenIntent,
  type AddDeployedTokenIntent,
  type AddTokenRelationIntent,
  type DeleteAbstractTokenIntent,
  type DeleteDeployedTokenIntent,
  type DeleteTokenRelationIntent,
  Intent,
  type MergeAbstractTokenIntent,
  type UpdateAbstractTokenIntent,
  type UpdateDeployedTokenIntent,
  type UpdateTokenRelationIntent,
} from './intents'
import { getLogger } from './logger'
import type {
  AbstractTokenUpdateable,
  CoingeckoEntry,
} from './schemas/AbstractToken'
import type { DeployedTokenUpdateable } from './schemas/DeployedToken'
import {
  type ManualRelationEvidence,
  ManualRelationEvidenceInput,
  type TokenRelationPrimaryKey,
  type TokenRelationRecord,
} from './schemas/TokenRelation'

export type Plan = v.infer<typeof Plan>
export const Plan = v.object({
  intent: Intent,
  commands: v.array(Command),
})

export type PlanningResult = PlanningResultSuccess | PlanningResultError

export class PlanningError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlanningError'
  }
}

interface PlanningResultSuccess {
  outcome: 'success'
  plan: Plan
}

interface PlanningResultError {
  outcome: 'error'
  error: string
}

export interface PlanOptions {
  /** Email of the user the plan is being built for; used to stamp manual
   * proofs on any deployed-token assignment changes. */
  user: string
  skipLogs?: boolean
}

export async function generatePlan(
  db: TokenDatabase,
  intent: Intent,
  opts: PlanOptions,
): Promise<PlanningResult> {
  const logger = getLogger().for('generatePlan')
  if (!opts.skipLogs) {
    logger.info('Generating plan', { intent, user: opts.user })
  }
  let commands: Command[]
  try {
    switch (intent.type) {
      case 'AddAbstractTokenIntent':
        commands = await planAddAbstractToken(db, intent)
        break
      case 'UpdateAbstractTokenIntent':
        commands = await planUpdateAbstractToken(db, intent)
        break
      case 'DeleteAbstractTokenIntent':
        commands = await planDeleteAbstractToken(db, intent)
        break
      case 'MergeAbstractTokenIntent':
        commands = await planMergeAbstractToken(db, intent, opts)
        break
      case 'AddDeployedTokenIntent':
        commands = await planAddDeployedToken(db, intent, opts)
        break
      case 'UpdateDeployedTokenIntent':
        commands = await planUpdateDeployedToken(db, intent, opts)
        break

      case 'DeleteDeployedTokenIntent':
        commands = await planDeleteDeployedToken(db, intent)
        break
      case 'AddTokenRelationIntent':
        commands = await planAddTokenRelation(db, intent, opts)
        break
      case 'UpdateTokenRelationIntent':
        commands = await planUpdateTokenRelation(db, intent, opts)
        break
      case 'DeleteTokenRelationIntent':
        commands = await planDeleteTokenRelation(db, intent)
        break
      default:
        assertUnreachable(intent)
    }
  } catch (error: unknown) {
    if (error instanceof PlanningError) {
      return {
        outcome: 'error',
        error: error.message,
      }
    }
    throw error
  }

  if (!opts.skipLogs) {
    logger.info('Plan generated', { commands, user: opts.user })
  }
  return {
    outcome: 'success',
    plan: {
      intent,
      commands,
    },
  }
}

async function planAddAbstractToken(
  db: TokenDatabase,
  intent: AddAbstractTokenIntent,
): Promise<Command[]> {
  const existingViaId = await db.abstractToken.findById(intent.record.id)
  if (existingViaId) {
    throw new PlanningError(`AbstractToken ${intent.record.id} already exist`)
  }
  if (intent.record.issuer) {
    const existingViaIssuerAndSymbol =
      await db.abstractToken.findByIssuerAndSymbol(
        intent.record.issuer,
        intent.record.symbol,
      )
    if (existingViaIssuerAndSymbol) {
      throw new PlanningError(
        `AbstractToken with issuer '${intent.record.issuer}' and symbol '${intent.record.symbol}' already exists`,
      )
    }
  }
  return [
    {
      type: 'AddAbstractTokenCommand',
      record: intent.record,
    },
  ]
}

async function planUpdateAbstractToken(
  db: TokenDatabase,
  intent: UpdateAbstractTokenIntent,
): Promise<Command[]> {
  const existing = await db.abstractToken.findById(intent.id)
  if (existing === undefined) {
    throw new PlanningError(`AbstractToken ${intent.id} doesn't exist`)
  }
  return [
    {
      type: 'UpdateAbstractTokenCommand',
      existing,
      id: intent.id,
      update: intent.update,
    },
  ]
}

async function planDeleteAbstractToken(
  db: TokenDatabase,
  intent: DeleteAbstractTokenIntent,
): Promise<Command[]> {
  const existing = await db.abstractToken.findById(intent.id)
  if (existing === undefined) {
    throw new PlanningError(`AbstractToken ${intent.id} doesn't exist`)
  }
  return [
    {
      type: 'DeleteAbstractTokenCommand',
      id: intent.id,
      existing,
    },
  ]
}

async function planMergeAbstractToken(
  db: TokenDatabase,
  intent: MergeAbstractTokenIntent,
  opts: PlanOptions,
): Promise<Command[]> {
  // The intent carries display ids (`<id>:<issuer>:<symbol>`) for readability
  // in the history table; here we only need the unique identifier prefix.
  const sourceId = extractAbstractTokenId(intent.sourceId)
  const targetId = extractAbstractTokenId(intent.targetId)

  if (sourceId === targetId) {
    throw new PlanningError('Cannot merge an abstract token into itself')
  }

  const [source, target, deployedTokens] = await Promise.all([
    db.abstractToken.findById(sourceId),
    db.abstractToken.findById(targetId),
    db.deployedToken.getByAbstractTokenId(sourceId),
  ])

  if (source === undefined) {
    throw new PlanningError(`AbstractToken ${sourceId} doesn't exist`)
  }
  if (target === undefined) {
    throw new PlanningError(`AbstractToken ${targetId} doesn't exist`)
  }

  const commands: Command[] = []
  // The note keeps the merged-away token visible at a glance on the target
  // (its full record is only recoverable from history). Unlike the copied
  // CoinGecko entries it is appended even when the source has no CoinGecko
  // data. It must be deterministic (no timestamp): executePlan regenerates
  // the plan and deep-compares it with the confirmed one.
  const mergeNote = `Merged from ${source.id}:${source.issuer}:${source.symbol} (category: ${source.category}, coingeckoId: ${source.coingeckoId})`
  const update: AbstractTokenUpdateable = {
    comment: target.comment ? `${target.comment}\n${mergeNote}` : mergeNote,
  }
  const additionalCoingeckoEntries = mergeAdditionalCoingeckoEntries(
    target,
    source,
  )
  if (
    JSON.stringify(additionalCoingeckoEntries) !==
    JSON.stringify(target.additionalCoingeckoEntries ?? [])
  ) {
    update.additionalCoingeckoEntries = additionalCoingeckoEntries
  }
  commands.push({
    type: 'UpdateAbstractTokenCommand',
    existing: target,
    id: target.id,
    update,
  })

  for (const deployedToken of [...deployedTokens].sort(compareDeployedTokens)) {
    commands.push({
      type: 'UpdateDeployedTokenCommand',
      existing: deployedToken,
      pk: {
        chain: deployedToken.chain,
        address: deployedToken.address,
      },
      update: stampUpdateProof(
        { abstractTokenId: target.id },
        deployedToken,
        opts.user,
      ),
    })
  }

  commands.push({
    type: 'DeleteAbstractTokenCommand',
    id: source.id,
    existing: source,
  })

  return commands
}

async function planAddDeployedToken(
  db: TokenDatabase,
  intent: AddDeployedTokenIntent,
  opts: PlanOptions,
): Promise<Command[]> {
  const record = intent.record
  const existing = await db.deployedToken.findByChainAndAddress(record)
  if (existing !== undefined) {
    throw new PlanningError(
      `DeployedToken ${record.chain}+${record.address} already exist`,
    )
  }
  return [
    {
      type: 'AddDeployedTokenCommand',
      record: stampInsertProof(record, opts.user),
    },
  ]
}

async function planUpdateDeployedToken(
  db: TokenDatabase,
  intent: UpdateDeployedTokenIntent,
  opts: PlanOptions,
): Promise<Command[]> {
  const existing = await db.deployedToken.findByChainAndAddress(intent.pk)
  if (existing === undefined) {
    throw new PlanningError(
      `DeployedToken ${intent.pk.chain}+${intent.pk.address} doesn't exist`,
    )
  }
  return [
    {
      type: 'UpdateDeployedTokenCommand',
      existing,
      pk: intent.pk,
      update: stampUpdateProof(intent.update, existing, opts.user),
    },
  ]
}

async function planDeleteDeployedToken(
  db: TokenDatabase,
  intent: DeleteDeployedTokenIntent,
): Promise<Command[]> {
  const existing = await db.deployedToken.findByChainAndAddress(intent.pk)
  if (existing === undefined) {
    throw new PlanningError(
      `DeployedToken ${intent.pk.chain}+${intent.pk.address} doesn't exist`,
    )
  }
  // Token relations touching this token are deliberately left in place:
  // they are observations of on-chain transfers and stay valid whether or
  // not the address is catalogued as a deployed token.
  // See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
  return [
    {
      type: 'DeleteDeployedTokenCommand',
      pk: intent.pk,
      existing,
    },
  ]
}

function mergeAdditionalCoingeckoEntries(
  target: {
    coingeckoId: string | null
    additionalCoingeckoEntries: CoingeckoEntry[] | null
  },
  source: {
    coingeckoId: string | null
    coingeckoListingTimestamp: number | null
    iconUrl: string | null
    additionalCoingeckoEntries: CoingeckoEntry[] | null
  },
): CoingeckoEntry[] {
  const entries = [...(target.additionalCoingeckoEntries ?? [])]
  const seen = new Set(entries.map((entry) => entry.coingeckoId))
  if (target.coingeckoId) {
    seen.add(target.coingeckoId)
  }

  for (const entry of sourceCoingeckoEntries(source)) {
    if (seen.has(entry.coingeckoId)) {
      continue
    }
    entries.push(entry)
    seen.add(entry.coingeckoId)
  }

  return entries
}

function sourceCoingeckoEntries(source: {
  coingeckoId: string | null
  coingeckoListingTimestamp: number | null
  iconUrl: string | null
  additionalCoingeckoEntries: CoingeckoEntry[] | null
}): CoingeckoEntry[] {
  return [
    ...(source.coingeckoId
      ? [
          {
            coingeckoId: source.coingeckoId,
            coingeckoListingTimestamp: source.coingeckoListingTimestamp,
            iconUrl: source.iconUrl,
          },
        ]
      : []),
    ...(source.additionalCoingeckoEntries ?? []),
  ]
}

function compareDeployedTokens(a: DeployedTokenRecord, b: DeployedTokenRecord) {
  return a.chain.localeCompare(b.chain) || a.address.localeCompare(b.address)
}

/**
 * Abstract token display ids have the shape `<id>:<issuer>:<symbol>`. Only the
 * `<id>` prefix is the unique identifier used to look tokens up.
 */
function extractAbstractTokenId(displayId: string): string {
  return displayId.split(':')[0]
}

async function planAddTokenRelation(
  db: TokenDatabase,
  intent: AddTokenRelationIntent,
  opts: PlanOptions,
): Promise<Command[]> {
  // These mirror the table's CHECK constraints, so a violation surfaces here
  // as a friendly planning error instead of failing the execute transaction.
  if (intent.record.bridgeType === 'unknown') {
    throw new PlanningError(
      "A token relation cannot use bridge type 'unknown' — pick the mechanism the bridge uses",
    )
  }
  if (
    intent.record.lockedToken !== null &&
    intent.record.bridgeType !== 'lockAndMint'
  ) {
    throw new PlanningError(
      `Only a lockAndMint relation has a locked token — a ${intent.record.bridgeType} relation must not name one`,
    )
  }

  // A human names the two endpoints in whatever order they think of them; the
  // pair is unordered, so the stored order is derived rather than taken.
  const record = normalizeTokenRelation({
    ...intent.record,
    transfer: stampManualRelationEvidence(intent.record, opts.user),
  })
  if (
    record.tokenAChain === record.tokenBChain &&
    record.tokenAAddress === record.tokenBAddress
  ) {
    throw new PlanningError(
      'A token relation must connect two different tokens',
    )
  }
  await assertRelationEndpointsExist(db, record)
  const existing = await db.tokenRelation.findByPrimaryKey(
    toTokenRelationPrimaryKey(record),
  )
  if (existing !== undefined) {
    throw new PlanningError(
      `TokenRelation ${formatTokenRelationPrimaryKey(record)} already exists`,
    )
  }

  return [
    {
      type: 'AddTokenRelationCommand',
      record,
    },
  ]
}

async function planUpdateTokenRelation(
  db: TokenDatabase,
  intent: UpdateTokenRelationIntent,
  opts: PlanOptions,
): Promise<Command[]> {
  // Mirrors the table's CHECK constraint; see planAddTokenRelation.
  if (
    intent.update.lockedToken != null &&
    intent.pk.bridgeType !== 'lockAndMint'
  ) {
    throw new PlanningError(
      `Only a lockAndMint relation has a locked token — a ${intent.pk.bridgeType} relation must not name one`,
    )
  }
  const existing = await db.tokenRelation.findByPrimaryKey(intent.pk)
  if (existing === undefined) {
    throw new PlanningError(
      `TokenRelation ${formatTokenRelationPrimaryKey(intent.pk)} doesn't exist`,
    )
  }

  const update =
    intent.update.transfer === undefined
      ? intent.update
      : {
          ...intent.update,
          transfer: stampManualRelationEvidence(
            { plugin: intent.pk.plugin, transfer: intent.update.transfer },
            opts.user,
          ),
        }

  return [
    {
      type: 'UpdateTokenRelationCommand',
      pk: intent.pk,
      existing,
      update,
    },
  ]
}

/**
 * The `transfer` evidence a relation write should store. For a relation whose
 * plugin is the `manual` sentinel the evidence must be a manual entry, and its
 * `user` is stamped here — at plan time, like deployed-token assignment
 * proofs — so the confirmation diff already shows the record exactly as it
 * will be stored, and the client never asserts who is writing. Evidence of
 * relations with any other plugin passes through untouched.
 *
 * No timestamp is stamped: executePlan regenerates the plan and requires it
 * to deep-equal the confirmed one, and the history row carries the time.
 */
function stampManualRelationEvidence(
  relation: { plugin: string; transfer: JsonValue },
  user: string,
): JsonValue {
  if (relation.plugin !== MANUAL_RELATION_PLUGIN) {
    return relation.transfer
  }
  const evidence = ManualRelationEvidenceInput.safeParse(relation.transfer)
  if (!evidence.success) {
    throw new PlanningError(
      `A relation with plugin '${MANUAL_RELATION_PLUGIN}' must carry manual-entry evidence: { kind: 'manual', comment, bridge }`,
    )
  }
  return { ...evidence.data, user } satisfies ManualRelationEvidence
}

async function planDeleteTokenRelation(
  db: TokenDatabase,
  intent: DeleteTokenRelationIntent,
): Promise<Command[]> {
  const existing = await db.tokenRelation.findByPrimaryKey(intent.pk)
  if (existing === undefined) {
    throw new PlanningError(
      `TokenRelation ${formatTokenRelationPrimaryKey(intent.pk)} doesn't exist`,
    )
  }

  return [
    {
      type: 'DeleteTokenRelationCommand',
      pk: intent.pk,
      existing,
    },
  ]
}

async function assertRelationEndpointsExist(
  db: TokenDatabase,
  relation: {
    tokenAChain: string
    tokenAAddress: string
    tokenBChain: string
    tokenBAddress: string
  },
): Promise<void> {
  const [tokenA, tokenB] = await Promise.all([
    db.deployedToken.findByChainAndAddress({
      chain: relation.tokenAChain,
      address: relation.tokenAAddress,
    }),
    db.deployedToken.findByChainAndAddress({
      chain: relation.tokenBChain,
      address: relation.tokenBAddress,
    }),
  ])

  if (tokenA === undefined) {
    throw new PlanningError(
      `DeployedToken ${relation.tokenAChain}+${relation.tokenAAddress} doesn't exist`,
    )
  }
  if (tokenB === undefined) {
    throw new PlanningError(
      `DeployedToken ${relation.tokenBChain}+${relation.tokenBAddress} doesn't exist`,
    )
  }
}

function toTokenRelationPrimaryKey(
  relation: TokenRelationRecord,
): TokenRelationPrimaryKey {
  return {
    tokenAChain: relation.tokenAChain,
    tokenAAddress: relation.tokenAAddress,
    tokenBChain: relation.tokenBChain,
    tokenBAddress: relation.tokenBAddress,
    plugin: relation.plugin,
    bridgeType: relation.bridgeType,
  }
}

function formatTokenRelationPrimaryKey(pk: TokenRelationPrimaryKey): string {
  return `${pk.tokenAChain}+${pk.tokenAAddress} <-> ${pk.tokenBChain}+${pk.tokenBAddress} via ${pk.plugin} (${pk.bridgeType})`
}

function stampInsertProof(
  record: DeployedTokenRecord,
  user: string,
): DeployedTokenRecord {
  return {
    ...record,
    abstractTokenAssignmentProof:
      record.abstractTokenId === null ? null : manualProof(user),
  }
}

function stampUpdateProof(
  update: DeployedTokenUpdateable,
  existing: DeployedTokenRecord,
  user: string,
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
      update.abstractTokenId === null ? null : manualProof(user),
  }
}
