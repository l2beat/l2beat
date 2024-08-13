import { router } from '../../trpc'
import { costsRouter } from './costs'

export const scalingRouter = router({
  costs: costsRouter,
})
