import { v } from '@l2beat/validate'
import { getSearchBarEntries } from '~/server/features/search-bar/getSearchBarEntries'
import { procedure, router } from '../trpc'

export const searchBarRouter = router({
  search: procedure
    .input(v.string())
    .query(({ input }) => getSearchBarEntries(input)),
})
