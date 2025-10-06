import { isDeepStrictEqual } from 'node:util'
import type { TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { Command } from './commands'
import type { Intent } from './intents'
import { generatePlan, type Plan } from './planning'

type PlanExecutionResult = PlanExecutionSuccess | PlanExecutionError

interface PlanExecutionError {
  outcome: 'error'
  error: string
}

interface PlanExecutionSuccess {
  outcome: 'success'
}

export function executePlan(
  db: TokenDatabase,
  plan: Plan,
): Promise<PlanExecutionResult> {
  return db.transaction(
    async (): Promise<PlanExecutionResult> => {
      const regeneratedPlan = await generatePlan(db, plan.intent)
      if (!isDeepStrictEqual(regeneratedPlan, plan)) {
        return {
          outcome: 'error',
          error:
            'Plan is no longer valid due to recent changes to the database',
        }
      }

      for (const command of plan.commands) {
        await executeCommand(db, command)
      }
      return {
        outcome: 'success',
      }
    },
    // Using SERIALIZABLE isolation level ensures that no other transaction can
    // run at the same time. This prevents situations where we make a query
    // (e.g. selecting all connected tokens), prepare an update based on its
    // result, but in the meantime someone else makes an update that
    // invalidates our query (e.g. adds a new connection).  In reality Postgres is
    // smart enough to allow parallel transactions as long as they don't break
    // the "illusion" of no two transactions running at the same time (in
    // "serialzed" order)
    'serializable',
  )
}

export async function planAndExecute(
  db: TokenDatabase,
  intent: Intent,
): Promise<void> {
  await db.transaction(async () => {
    const planningResult = await generatePlan(db, intent)
    if (planningResult.outcome === 'error') {
      throw new Error(`Error during planning: ${planningResult.error}`)
    }
    for (const command of planningResult.plan.commands) {
      await executeCommand(db, command)
    }
  }, 'serializable')
}

async function executeCommand(db: TokenDatabase, command: Command) {
  switch (command.type) {
    case 'AddAbstractTokenCommand':
      await db.abstractToken.insert(command.record)
      break
    case 'UpdateAbstractTokenCommand':
      await db.abstractToken.update(command.update)
      break
    case 'DeleteAllAbstractTokensCommand':
      await db.abstractToken.deleteAll()
      break
    case 'AddDeployedTokenCommand':
      await db.deployedToken.insert(command.record)
      break
    case 'UpdateDeployedTokenCommand':
      await db.deployedToken.update(command.update)
      break
    default:
      assertUnreachable(command)
  }
}
