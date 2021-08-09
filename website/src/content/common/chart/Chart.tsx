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
    <section className="Chart" data-endpoint={endpoint}>
      <p className="Chart-Range">...</p>
      <div className="Chart-RangeControls">
        <ChartButton checked={days === 30} name="range" value="30D" />
        <ChartButton checked={days === 90} name="range" value="90D" />
        <ChartButton name="range" value="180D" />
        <ChartButton name="range" value="1Y" />
        <ChartButton name="range" value="MAX" />
      </div>
      <div className="Chart-View" role="img" aria-label="chart">
        <ChartLoader />
        <ChartHover />
        <div className="Chart-Lines">
          <div className="Chart-Line" />
          <div className="Chart-Line" />
          <div className="Chart-Line" />
          <div className="Chart-Line" />
          <div className="Chart-Line" />
        </div>
        <div className="Chart-Labels">
          <div className="Chart-Label">...</div>
          <div className="Chart-Label">...</div>
          <div className="Chart-Label">...</div>
          <div className="Chart-Label">...</div>
          <div className="Chart-Label">...</div>
        </div>
        <Logo className="Chart-Watermark" />
        <canvas className="Chart-Canvas" />
      </div>
      <div className="Chart-CurrencyControls">
        <ChartButton checked name="currency" value="USD" />
        <ChartButton name="currency" value="ETH" />
      </div>
      <p className="Chart-Description">...</p>
      <div className="Chart-ScaleControls">
        <ChartButton name="scale" value="LOG" />
        <ChartButton checked name="scale" value="LIN" />
      </div>
      {tokens && tokens.length > 0 && (
        <div className="Chart-TokenControls">
          <span className="Chart-TokenTitle">Tokens:</span>
          {tokens.map((x) => (
            <ChartButton
              key={x.symbol}
              name="token"
              value={x.symbol}
              endpoint={x.endpoint}
            />
          ))}
          <button className="Chart-MoreTokens">More…</button>
        </div>
      )}
    </section>
  )
}
