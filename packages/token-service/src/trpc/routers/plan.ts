import { v } from '@l2beat/validate'
import { db } from '../../database/db'
import { executePlan } from '../../execution'
import { IntentSchema } from '../../intents'
import { generatePlan, PlanSchema } from '../../planning'
import { protectedProcedure, router } from '../trpc'

export const planRouter = router({
  generate: protectedProcedure
    .input(v.object({ intent: IntentSchema }))
    .mutation(({ input }) => {
      return generatePlan(db, input.intent)
    }),
  execute: protectedProcedure
    .input(v.object({ plan: PlanSchema }))
    .mutation(({ input }) => {
      return executePlan(db, input.plan)
    }),
})
