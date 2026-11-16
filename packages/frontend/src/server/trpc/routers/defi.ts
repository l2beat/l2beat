import {
  DefiTvlChartParams,
  getDefiTvlChart,
} from '~/server/features/defi/getDefiTvlChart'
import {
  getLiquidStakingCostOfExitChart,
  getLiquidStakingYieldChart,
  LiquidStakingChartsParams,
} from '~/server/features/defi/liquid-staking/getLiquidStakingCharts'
import { procedure, router } from '../trpc'

export const defiRouter = router({
  tvlChart: procedure
    .input(DefiTvlChartParams)
    .query(({ input }) => getDefiTvlChart(input)),
  liquidStakingYieldChart: procedure
    .input(LiquidStakingChartsParams)
    .query(({ input }) => getLiquidStakingYieldChart(input)),
  liquidStakingCostOfExitChart: procedure
    .input(LiquidStakingChartsParams)
    .query(({ input }) => getLiquidStakingCostOfExitChart(input)),
})
