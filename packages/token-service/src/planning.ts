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

export async function plan(db: TokenDatabase, intent: Intent): Promise<Plan> {
  let commands: Command[]
  switch (intent.type) {
    case 'AddAbstractTokenIntent':
      commands = planAddAbstractToken(intent)
      break
    case 'UpdateAbstractTokenIntent':
      commands = await planUpdateAbstractToken(db, intent)
      break
    case 'AddDeployedTokenIntent':
      commands = planAddDeployedToken(intent)
      break
    case 'UpdateDeployedTokenIntent':
      commands = await planUpdateDeployedToken(db, intent)
      break
    default:
      assertUnreachable(intent)
  }

  return {
    intent,
    commands,
  }
}

function planAddAbstractToken(intent: AddAbstractTokenIntent): Command[] {
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
    throw new Error(`AbstractToken ${intent.update.id} doesn't exist`)
  }
  return [
    {
      type: 'UpdateAbstractTokenCommand',
      before,
      update: intent.update,
    },
  ]
}

function planAddDeployedToken(intent: AddDeployedTokenIntent): Command[] {
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
    throw new Error(`DeployedToken ${intent.update.id} doesn't exist`)
  }
  return [
    {
      type: 'UpdateDeployedTokenCommand',
      before,
      update: intent.update,
    },
  ]
}
