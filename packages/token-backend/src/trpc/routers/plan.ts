import { db } from '../../database/db'
import { executePlan } from '../../execution'
import { Intent } from '../../intents'
import { generatePlan, Plan } from '../../planning'
import { protectedProcedure, router } from '../trpc'

export const planRouter = router({
  generate: protectedProcedure.input(Intent).mutation(({ input }) => {
    return generatePlan(db, input)
  }),
  execute: protectedProcedure.input(Plan).mutation(({ input }) => {
    return executePlan(db, input)
  }),
})
