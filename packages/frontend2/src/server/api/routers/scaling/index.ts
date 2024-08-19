import { router } from '../../trpc'
import { costsRouter } from './costs'
import { summaryRouter } from './summary'

export const scalingRouter = router({
  summary: summaryRouter,
  costs: costsRouter,
})
