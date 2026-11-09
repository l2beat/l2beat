import { Colored, Label } from './GasFeesStats'
import mock from './pageMock.json'

const PAID = 'var(--chart-stacked-pink)'
/** The chart pink is too light for text on a light background */
const PAID_TEXT = 'var(--brand)'
const FAST = 'var(--chart-stacked-blue)'

export function GasFeesHero() {
  const { tips } = mock
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Tips on Ethereum</Label>
        <p className="font-bold text-2xl leading-tight tracking-tight md:text-3xl">
          Ordinary transactions tipped{' '}
          <Colored color={PAID_TEXT}>{usd(tips.ordinaryUsd)}</Colored> in a
          year.
          <br className="max-md:hidden" /> At our fast tip, that's{' '}
          <Colored color={FAST}>{usd(tips.atFastUsd)}</Colored>.
        </p>
      </div>
      <div className="grid grid-cols-[128px_minmax(0,1fr)] items-center gap-x-4 gap-y-2">
        <Label>Tips paid</Label>
        <ScaleBar
          value={tips.ordinaryUsd}
          max={tips.ordinaryUsd}
          color={PAID}
        />
        <Label>At our fast tip</Label>
        <ScaleBar value={tips.atFastUsd} max={tips.ordinaryUsd} color={FAST} />
      </div>
      <dl className="flex flex-col gap-1 text-secondary text-xs">
        <div>
          <dt className="inline font-bold text-primary">Fast tip: </dt>
          <dd className="inline">
            our estimate, from the last 300 blocks only, of the tip that lands
            95% of transactions in the next block.
          </dd>
        </div>
        <div>
          <dt className="inline font-bold text-primary">Ordinary: </dt>
          <dd className="inline">
            tips under 2.5 gwei, just above the pile at 2 gwei. That leaves out{' '}
            {usd(tips.positionalUsd)}.
          </dd>
        </div>
      </dl>
    </div>
  )
}

/** A bar on a scale shared by its rows, so a small value stays small */
function ScaleBar({
  value,
  max,
  color,
}: {
  value: number
  max: number
  color: string
}) {
  const share = value / max
  return (
    <div className="flex h-11 items-center font-semibold text-sm">
      <span
        className="flex h-full items-center overflow-hidden whitespace-nowrap rounded-lg px-3 text-black"
        style={{ width: `${share * 100}%`, backgroundColor: color }}
      >
        {usd(value)}
      </span>
    </div>
  )
}

function usd(value: number) {
  return `$${Math.round(value / 1e6)}M`
}
