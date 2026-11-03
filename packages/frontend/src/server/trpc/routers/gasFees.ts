import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import {
  GasFeesChartParams,
  getGasFeesChart,
} from '~/server/features/gas-fees/getGasFeesChart'
import { getGasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'
import {
  GasFeesSummaryParams,
  getGasFeesSummary,
} from '~/server/features/gas-fees/getGasFeesSummary'
import { procedure, router } from '../trpc'

const gasFeesPageProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_GAS_FEES_PAGE) throw new TRPCError({ code: 'NOT_FOUND' })
  return next()
})

export const gasFeesRouter = router({
  chart: gasFeesPageProcedure
    .input(GasFeesChartParams)
    .query(({ input }) => getGasFeesChart(input)),
  summary: gasFeesPageProcedure
    .input(GasFeesSummaryParams)
    .query(({ input }) => getGasFeesSummary(input)),
  recent: gasFeesPageProcedure.query(() => getGasFeesRecent()),
})
