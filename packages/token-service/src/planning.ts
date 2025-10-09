import type { TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { CommandSchema } from './commands'
import { IntentSchema } from './intents'

export type PlanSchema = v.infer<typeof PlanSchema>
export const PlanSchema = v.object({
  intent: IntentSchema,
  commands: v.array(CommandSchema),
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
  intent: IntentSchema,
): Promise<PlanningResult> {
  let commands: CommandSchema[]
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
  intent: Extract<IntentSchema, { type: 'AddAbstractTokenIntent' }>,
): Promise<CommandSchema[]> {
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
  intent: Extract<IntentSchema, { type: 'UpdateAbstractTokenIntent' }>,
): Promise<CommandSchema[]> {
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
  intent: Extract<IntentSchema, { type: 'DeleteAllAbstractTokensIntent' }>,
): CommandSchema[] {
  return [
    {
      type: 'DeleteAllAbstractTokensCommand',
    },
  ]
}

async function planAddDeployedToken(
  db: TokenDatabase,
  intent: Extract<IntentSchema, { type: 'AddDeployedTokenIntent' }>,
): Promise<CommandSchema[]> {
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
  intent: Extract<IntentSchema, { type: 'UpdateDeployedTokenIntent' }>,
): Promise<CommandSchema[]> {
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
  intent: Extract<IntentSchema, { type: 'DeleteAllDeployedTokensIntent' }>,
): CommandSchema[] {
  return [
    {
      type: 'DeleteAllDeployedTokensCommand',
    },
  ]
}
