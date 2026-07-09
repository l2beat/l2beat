import type { DeployedTokenRecord, TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
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
  type UpdateAbstractTokenIntent,
  type UpdateDeployedTokenIntent,
  type UpdateTokenRelationIntent,
} from './intents'
import { getLogger } from './logger'
import type { DeployedTokenUpdateable } from './schemas/DeployedToken'
import type { TokenRelationPrimaryKey } from './schemas/TokenRelation'

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
        commands = await planAddTokenRelation(db, intent)
        break
      case 'UpdateTokenRelationIntent':
        commands = await planUpdateTokenRelation(db, intent)
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

async function planAddTokenRelation(
  db: TokenDatabase,
  intent: AddTokenRelationIntent,
): Promise<Command[]> {
  await assertRelationEndpointsExist(db, intent.record)

  const existing = await db.tokenRelation.findByPrimaryKey(
    toTokenRelationPrimaryKey(intent.record),
  )
  if (existing !== undefined) {
    throw new PlanningError(
      `TokenRelation ${formatTokenRelationPrimaryKey(intent.record)} already exists`,
    )
  }

  return [
    {
      type: 'AddTokenRelationCommand',
      record: intent.record,
    },
  ]
}

async function planUpdateTokenRelation(
  db: TokenDatabase,
  intent: UpdateTokenRelationIntent,
): Promise<Command[]> {
  const existing = await db.tokenRelation.findByPrimaryKey(intent.pk)
  if (existing === undefined) {
    throw new PlanningError(
      `TokenRelation ${formatTokenRelationPrimaryKey(intent.pk)} doesn't exist`,
    )
  }

  return [
    {
      type: 'UpdateTokenRelationCommand',
      pk: intent.pk,
      existing,
      update: intent.update,
    },
  ]
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
    tokenFromChain: string
    tokenFromAddress: string
    tokenToChain: string
    tokenToAddress: string
  },
): Promise<void> {
  const [tokenFrom, tokenTo] = await Promise.all([
    db.deployedToken.findByChainAndAddress({
      chain: relation.tokenFromChain,
      address: relation.tokenFromAddress,
    }),
    db.deployedToken.findByChainAndAddress({
      chain: relation.tokenToChain,
      address: relation.tokenToAddress,
    }),
  ])

  if (tokenFrom === undefined) {
    throw new PlanningError(
      `DeployedToken ${relation.tokenFromChain}+${relation.tokenFromAddress} doesn't exist`,
    )
  }
  if (tokenTo === undefined) {
    throw new PlanningError(
      `DeployedToken ${relation.tokenToChain}+${relation.tokenToAddress} doesn't exist`,
    )
  }
}

function toTokenRelationPrimaryKey(relation: {
  tokenFromChain: string
  tokenFromAddress: string
  tokenToChain: string
  tokenToAddress: string
  plugin: string
  sourceWasBurned: boolean
  destinationWasMinted: boolean
}): TokenRelationPrimaryKey {
  return {
    tokenFromChain: relation.tokenFromChain,
    tokenFromAddress: relation.tokenFromAddress,
    tokenToChain: relation.tokenToChain,
    tokenToAddress: relation.tokenToAddress,
    plugin: relation.plugin,
    sourceWasBurned: relation.sourceWasBurned,
    destinationWasMinted: relation.destinationWasMinted,
  }
}

function formatTokenRelationPrimaryKey(pk: TokenRelationPrimaryKey): string {
  return `${pk.tokenFromChain}+${pk.tokenFromAddress} -> ${pk.tokenToChain}+${pk.tokenToAddress} via ${pk.plugin} (${pk.sourceWasBurned}/${pk.destinationWasMinted})`
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
