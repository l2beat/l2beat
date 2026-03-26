import type { InteropBackofficeApiImplementations } from '../implementations'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

// Simple example to show how contract implementations work for the time being
export function createStatusRouter(I: InteropBackofficeApiImplementations) {
  return router({
    memory: publicProcedure.query(() => {
      return I.status.memory()
    }),
  })
}
