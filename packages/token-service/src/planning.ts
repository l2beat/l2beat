import type { TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { Command } from './commands'
import type {
  AddAbstractTokenIntent,
  AddDeployedTokenIntent,
  Intent,
  UpdateAbstractTokenIntent,
  UpdateDeployedTokenIntent,
} from './intents'

export interface Plan {
  intent: Intent
  commands: Command[]
}

export type PlanningResult = PlanningResultSuccess | PlanningResultError

export class PlanningError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlanningError'
  }
}

interface PlanningResultSuccess {
  type: 'success'
  plan: Plan
}

interface PlanningResultError {
  type: 'error'
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
      case 'AddDeployedTokenIntent':
        commands = await planAddDeployedToken(db, intent)
        break
      case 'UpdateDeployedTokenIntent':
        commands = await planUpdateDeployedToken(db, intent)
        break
      default:
        assertUnreachable(intent)
    }
  } catch (error: unknown) {
    if (error instanceof PlanningError) {
      return {
        type: 'error',
        error: error.message,
      }
    }
    throw error
  }

  return {
    type: 'success',
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
  const before = await db.abstractToken.findById(intent.update.id)
  if (before === undefined) {
    throw new PlanningError(`AbstractToken ${intent.update.id} doesn't exist`)
  }
  return [
    {
      type: 'UpdateAbstractTokenCommand',
      before,
      update: intent.update,
    },
  ]
}

async function planAddDeployedToken(
  db: TokenDatabase,
  intent: AddDeployedTokenIntent,
): Promise<Command[]> {
  const existing = await db.deployedToken.findById(intent.record.id)
  if (existing !== undefined) {
    throw new PlanningError(`DeployedToken ${intent.record.id} already exist`)
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
  intent: UpdateDeployedTokenIntent,
): Promise<Command[]> {
  const before = await db.deployedToken.findById(intent.update.id)
  if (before === undefined) {
    throw new PlanningError(`DeployedToken ${intent.update.id} doesn't exist`)
  }
  return [
    {
      type: 'UpdateDeployedTokenCommand',
      before,
      update: intent.update,
    },
  ]
}
