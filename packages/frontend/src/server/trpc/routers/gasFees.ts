import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import {
  GasFeesChartParams,
  getGasFeesChart,
} from '~/server/features/gas-fees/daily/getGasFeesChart'
import {
  GasFeesSummaryParams,
  getGasFeesSummary,
} from '~/server/features/gas-fees/daily/getGasFeesSummary'
import { getGasFeesLiveTips } from '~/server/features/gas-fees/tipping/getGasFeesLiveTips'
import { procedure, router } from '../trpc'

const gasFeesProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_GAS_FEES_PAGE) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  return next()
})

export const gasFeesRouter = router({
  chart: gasFeesProcedure
    .input(GasFeesChartParams)
    .query(({ input }) => getGasFeesChart(input)),
  summary: gasFeesProcedure
    .input(GasFeesSummaryParams)
    .query(({ input }) => getGasFeesSummary(input)),
  liveTips: gasFeesProcedure.query(() => getGasFeesLiveTips()),
})
