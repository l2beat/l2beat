import { z } from 'zod'

import { procedure, router } from '~/server/api/trpc'

export const exampleRouter = router({
  hello: procedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    }
  }),
})
