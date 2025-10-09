import { v } from '@l2beat/validate'
import { executePlan } from '../../execution'
import { IntentSchema } from '../../intents'
import { generatePlan, PlanSchema } from '../../planning'
import { db } from '../database/db'
import { procedure, router } from '../trpc'

export const planRouter = router({
  generate: procedure
    .input(v.object({ intent: IntentSchema }))
    .mutation(({ input }) => {
      return generatePlan(db, input.intent)
    }),
  execute: procedure
    .input(v.object({ plan: PlanSchema }))
    .mutation(({ input }) => {
      return executePlan(db, input.plan)
    }),
})
