import { db } from '../../database/db'
import { executePlan } from '../../execution'
import { Intent } from '../../intents'
import { generatePlan, Plan } from '../../planning'
import { readWriteProcedure, router } from '../trpc'

export const planRouter = router({
  generate: readWriteProcedure.input(Intent).mutation(({ input, ctx }) => {
    return generatePlan(db, input, { meta: { email: ctx.email } })
  }),
  execute: readWriteProcedure.input(Plan).mutation(({ input, ctx }) => {
    return executePlan(db, input, { email: ctx.email })
  }),
})
