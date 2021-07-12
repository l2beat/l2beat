import { Logo } from '../../common'
import { ChartButton } from './ChartButton'

interface Props {
  initialData: string
}

export function Chart({ initialData }: Props) {
  return (
    <section className="chart">
      <p className="chart__range">...</p>
      <div className="chart__range-controls">
        <ChartButton name="range" value="30D" />
        <ChartButton name="range" value="90D" />
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
        <canvas className="chart__canvas" data-input={initialData} />
      </div>
      <div className="chart__currency-controls">
        <ChartButton name="currency" value="ETH" />
        <ChartButton name="currency" value="USD" />
      </div>
      <p className="chart__description">...</p>
      <div className="chart__scale-controls">
        <ChartButton name="scale" value="LOG" />
        <ChartButton name="scale" value="LIN" />
      </div>
    </section>
  )
}
