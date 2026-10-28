import {
  DefiTvlChartParams,
  getDefiTvlChart,
} from '~/server/features/defi/getDefiTvlChart'
import {
  getLiquidStakingCharts,
  LiquidStakingChartsParams,
} from '~/server/features/defi/liquid-staking/getLiquidStakingCharts'
import { procedure, router } from '../trpc'

export const defiRouter = router({
  tvlChart: procedure
    .input(DefiTvlChartParams)
    .query(({ input }) => getDefiTvlChart(input)),
  liquidStakingCharts: procedure
    .input(LiquidStakingChartsParams)
    .query(({ input }) => getLiquidStakingCharts(input)),
})
