import { Logo } from '../Logo'
import { ChartButton } from './ChartButton'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'

interface Props {
  endpoint: string
  tokens?: { symbol: string; endpoint: string }[]
  days?: 30 | 90
}

export function Chart({ endpoint, tokens, days = 90 }: Props) {
  return (
    <section className="chart" data-endpoint={endpoint}>
      <p className="chart__range">...</p>
      <div className="chart__range-controls">
        <ChartButton checked={days === 30} name="range" value="30D" />
        <ChartButton checked={days === 90} name="range" value="90D" />
        <ChartButton name="range" value="180D" />
        <ChartButton name="range" value="1Y" />
        <ChartButton name="range" value="MAX" />
      </div>
      <div className="chart__view" role="img" aria-label="chart">
        <ChartLoader />
        <ChartHover />
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
      {tokens && tokens.length > 0 && (
        <div className="chart__token-controls">
          <span className="chart__token-title">Filter by token:</span>
          {tokens.map((x) => (
            <ChartButton
              key={x.symbol}
              name="token"
              value={x.symbol}
              endpoint={x.endpoint}
            />
          ))}
        </div>
      )}
    </section>
  )
}
