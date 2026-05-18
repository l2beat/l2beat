import { isDeepStrictEqual } from 'node:util'
import type { TokenDatabase } from '@l2beat/database'
import { commitTokenChanges, type WriteSource } from './commitTokenChanges'
import type { Intent } from './intents'
import { getLogger } from './logger'
import { generatePlan, type Plan } from './planning'

export type PlanExecutionResult = PlanExecutionSuccess | PlanExecutionError

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
  meta?: {
    email: string
  },
): Promise<PlanExecutionResult> {
  const logger = getLogger().for('executePlan')
  logger.info('Executing plan', { plan, meta })
  return db.transaction(
    async (): Promise<PlanExecutionResult> => {
      const planRegeneration = await generatePlan(db, plan.intent, {
        skipLogs: true,
      })
      if (planRegeneration.outcome === 'error') {
        logger.error('Plan is no longer valid', {
          error: planRegeneration.error,
          meta,
        })
        return {
          outcome: 'error',
          error: `Plan is no longer valid: ${planRegeneration.error}`,
        }
      }
      if (!isDeepStrictEqual(planRegeneration.plan, plan)) {
        logger.error(
          'Plan is no longer valid due to recent changes to the database',
          { meta },
        )
        return {
          outcome: 'error',
          error:
            'Plan is no longer valid due to recent changes to the database',
        }
      }

      const source: WriteSource = {
        kind: 'user',
        email: meta?.email ?? 'unknown',
      }
      await commitTokenChanges(db, plan.commands, source)
      logger.info('Plan executed', { plan, meta })
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
  source: WriteSource,
): Promise<void> {
  await db.transaction(async () => {
    const planningResult = await generatePlan(db, intent)
    if (planningResult.outcome === 'error') {
      throw new Error(`Error during planning: ${planningResult.error}`)
    }
    await commitTokenChanges(db, planningResult.plan.commands, source)
  }, 'serializable')
}
