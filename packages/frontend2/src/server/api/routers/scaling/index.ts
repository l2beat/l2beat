import { router } from '../../trpc'
import { activityRouter } from './activity'
import { costsRouter } from './costs'

export const scalingRouter = router({
  costs: costsRouter,
  activity: activityRouter,
})
