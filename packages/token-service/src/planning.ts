import type { TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { Command } from './commands'
import { Intent } from './intents'

export type PlanSchema = v.infer<typeof PlanSchema>
export const PlanSchema = v.object({
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
  plan: PlanSchema
}

interface PlanningResultError {
  outcome: 'error'
  error: string
}

export async function generatePlan(
  db: TokenDatabase,
  intent: Intent,
): Promise<PlanningResult> {
  let commands: Command[]
  try {
    switch (intent.type) {
      case 'AddAbstractTokenIntent':
        commands = await planAddAbstractToken(db, intent)
        break
      case 'UpdateAbstractTokenIntent':
        commands = await planUpdateAbstractToken(db, intent)
        break
      case 'DeleteAllAbstractTokensIntent':
        commands = planDeleteAllAbstractTokens(intent)
        break
      case 'AddDeployedTokenIntent':
        commands = await planAddDeployedToken(db, intent)
        break
      case 'UpdateDeployedTokenIntent':
        commands = await planUpdateDeployedToken(db, intent)
        break
      case 'DeleteAllDeployedTokensIntent':
        commands = planDeleteAllDeployedTokens(intent)
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
  intent: Extract<Intent, { type: 'AddAbstractTokenIntent' }>,
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
  intent: Extract<Intent, { type: 'UpdateAbstractTokenIntent' }>,
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

function planDeleteAllAbstractTokens(
  intent: Extract<Intent, { type: 'DeleteAllAbstractTokensIntent' }>,
): Command[] {
  return [
    {
      type: 'DeleteAllAbstractTokensCommand',
    },
  ]
}

async function planAddDeployedToken(
  db: TokenDatabase,
  intent: Extract<Intent, { type: 'AddDeployedTokenIntent' }>,
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
      record: intent.record,
    },
  ]
}

async function planUpdateDeployedToken(
  db: TokenDatabase,
  intent: Extract<Intent, { type: 'UpdateDeployedTokenIntent' }>,
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
      update: intent.update,
    },
  ]
}

function planDeleteAllDeployedTokens(
  intent: Extract<Intent, { type: 'DeleteAllDeployedTokensIntent' }>,
): Command[] {
  return [
    {
      type: 'DeleteAllDeployedTokensCommand',
    },
  ]
}
