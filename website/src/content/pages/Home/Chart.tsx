import { Logo } from '../../common'
import { ChartButton } from './ChartButton'

interface Props {
  endpoint: string
}

export function Chart({ endpoint }: Props) {
  return (
    <section className="chart" data-endpoint={endpoint}>
      <p className="chart__range">...</p>
      <div className="chart__range-controls">
        <ChartButton name="range" value="30D" />
        <ChartButton checked name="range" value="90D" />
        <ChartButton name="range" value="180D" />
        <ChartButton name="range" value="1Y" />
        <ChartButton name="range" value="MAX" />
      </div>
      <div className="chart__view" role="img" aria-label="chart">
        <div className="chart__lines">
          <div className="chart__line" />
          <div className="chart__line" />
          <div className="chart__line" />
          <div className="chart__line" />
          <div className="chart__line" />
        </div>
        <div className="chart__labels">
          <div className="chart__label">...</div>
          <div className="chart__label">...</div>
          <div className="chart__label">...</div>
          <div className="chart__label">...</div>
          <div className="chart__label">...</div>
        </div>
        <Logo className="chart__watermark" />
        <canvas className="chart__canvas" />
      </div>
      <div className="chart__currency-controls">
        <ChartButton checked name="currency" value="USD" />
        <ChartButton name="currency" value="ETH" />
      </div>
      <p className="chart__description">...</p>
      <div className="chart__scale-controls">
        <ChartButton name="scale" value="LOG" />
        <ChartButton checked name="scale" value="LIN" />
      </div>
    </section>
  )
}
