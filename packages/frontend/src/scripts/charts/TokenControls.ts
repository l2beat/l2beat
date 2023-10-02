import { makeQuery } from '../query'
import { ChartDataController } from './ChartDataController'
import { TokenInfo } from './types'

export class TokenControls {
  constructor(private readonly chartDataController: ChartDataController) {
    const { $$ } = makeQuery(document.body)
    const tokenControls = $$('[data-role="chart-token-controls"] input')

    tokenControls.forEach((tokenControl) => {
      if (!tokenControl.dataset.tokenInfo) {
        throw new Error('Token control missing data-token-info')
      }

      const tokenInfo = TokenInfo.parse(
        JSON.parse(tokenControl.dataset.tokenInfo),
      )

      tokenControl.addEventListener('change', () => {
        tokenControl.dispatchEvent(
          new Event('close-slidecard', { bubbles: true }),
        )
        this.chartDataController.setChartType({
          type: 'project-token-tvl',
          info: tokenInfo,
        })
      })
    })
  }
}
