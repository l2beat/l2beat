import { router } from '../../trpc'
import { summaryRouter } from './summary'

export const bridgesRouter = router({
  summary: summaryRouter,
})
