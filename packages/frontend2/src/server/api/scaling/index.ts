import { router } from '../trpc'
import { activityRouter } from './activity'

export const scalingRouter = router({
  activity: activityRouter,
})
