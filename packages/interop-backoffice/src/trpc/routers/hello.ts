import { publicProcedure } from '../procedures'
import { router } from '../trpc'

export const helloRouter = router({
  hi: publicProcedure.query(() => {
    return 'Hello'
  }),
  hello: publicProcedure.query(() => {
    return "Hello, I'm a TRPC router!"
  }),
})
