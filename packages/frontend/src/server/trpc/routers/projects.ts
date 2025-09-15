import { v } from '@l2beat/validate'
import { getSearchBarProjects } from '~/server/features/projects/search-bar/getSearchBarProjects'
import { procedure, router } from '../trpc'

export const projectsRouter = router({
  searchBar: procedure
    .input(v.string())
    .query(({ input }) => getSearchBarProjects(input)),
})
