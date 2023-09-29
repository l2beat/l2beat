import { ChartRenderer, RenderParams } from '../renderer/ChartRenderer'
import { getActivityRenderParams } from './charts/getActivityRenderParams'
import { getDetailedTvlRenderParams } from './charts/getDetailedTvlRenderParams'
import { getTokenTvlRenderParams } from './charts/getTokenTvlRenderParams'
import { getTvlRenderParams } from './charts/getTvlRenderParams'
import { ChartControlsState } from './types'

export class ChartViewController {
  private state?: ChartControlsState

  constructor(private readonly chartRenderer: ChartRenderer) {}

  init(state: ChartControlsState) {
    this.state = state
    this.render()
  }

  configure(values: Partial<ChartControlsState>) {
    if (this.state) {
      this.state = { ...this.state, ...values }
      this.render()
    }
  }

  render() {
    // TODO: (chart) handle loading
    if (!this.state?.data) {
      return
    }
    this.chartRenderer.render(this.getRenderParams())
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getRenderParams(): RenderParams<any> {
    switch (this.state?.data?.type) {
      case 'tvl':
        return getTvlRenderParams(this.state)
      case 'activity':
        return getActivityRenderParams(this.state)
      case 'token-tvl':
        return getTokenTvlRenderParams(this.state)
      case 'detailed-tvl':
        return getDetailedTvlRenderParams(this.state)
      default:
        throw new Error('Unknown data type')
    }
  }
}
