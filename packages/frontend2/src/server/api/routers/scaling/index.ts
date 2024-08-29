import { router } from '../../trpc'
import { activityRouter } from './activity'
import { costsRouter } from './costs'
import { summaryRouter } from './summary'

export const scalingRouter = router({
  activity: activityRouter,
  costs: costsRouter,
  summary: summaryRouter,
})
