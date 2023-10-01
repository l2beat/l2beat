import { makeQuery } from '../../query'
import { ChartRenderer, RenderParams } from '../renderer/ChartRenderer'
import { getActivityRenderParams } from './charts/getActivityRenderParams'
import { getDetailedTvlRenderParams } from './charts/getDetailedTvlRenderParams'
import { getTokenTvlRenderParams } from './charts/getTokenTvlRenderParams'
import { getTvlRenderParams } from './charts/getTvlRenderParams'
import { ChartControlsState } from './types'

export class ChartViewController {
  private state?: ChartControlsState
  private readonly loader: HTMLElement
  private loaderTimeout?: NodeJS.Timeout

  constructor(private readonly chartRenderer: ChartRenderer) {
    const { $ } = makeQuery(document.body)
    this.loader = $('[data-role="chart-loader"]')
  }

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
    if (!this.state?.data) {
      return
    }

    this.chartRenderer.render(this.getRenderParams())
  }

  showLoader() {
    if (this.loaderTimeout) {
      return
    }
    this.loaderTimeout = setTimeout(
      () => this.loader.classList.remove('hidden'),
      300,
    )
  }

  hideLoader() {
    clearTimeout(this.loaderTimeout)
    this.loader.classList.add('hidden')
    this.loaderTimeout = undefined
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
