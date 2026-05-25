import { v } from '@l2beat/validate'
import { readOnlyProcedure } from '../../procedures'
import { router } from '../../trpc'

const HistoryPageInput = v.object({
  page: v.number(),
  pageSize: v.number(),
})

export const tokenDbHistoryRouter = router({
  getPage: readOnlyProcedure.input(HistoryPageInput).query(({ ctx, input }) => {
    const page = Math.max(1, Math.floor(input.page))
    const pageSize = Math.min(500, Math.max(1, Math.floor(input.pageSize)))

    return ctx.tokenDb.tokenDbHistory.getPage({
      offset: (page - 1) * pageSize,
      limit: pageSize,
    })
  }),
})
