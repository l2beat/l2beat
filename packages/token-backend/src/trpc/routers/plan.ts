import { executePlan } from '../../execution'
import { Intent } from '../../intents'
import { generatePlan, Plan } from '../../planning'
import { readWriteProcedure } from '../procedures'
import { router } from '../trpc'

export const planRouter = router({
  generate: readWriteProcedure.input(Intent).mutation(({ input, ctx }) => {
    return generatePlan(ctx.db, input, { meta: { email: ctx.session.email } })
  }),
  execute: readWriteProcedure.input(Plan).mutation(({ input, ctx }) => {
    return executePlan(ctx.db, input, { email: ctx.session.email })
  }),
})
