import { readOnlyProcedure } from '../../procedures'
import { router } from '../../trpc'

export const tokenDenylistRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) =>
    ctx.tokenDb.tokenDenylist.getAll(),
  ),
})
