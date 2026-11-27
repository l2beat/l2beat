import type { PriceOfSpeed } from '~/server/features/gas-fees/tipping/toPriceOfSpeed'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatDays, formatUsd, pluralDays } from '../../utils/format'
import { Eyebrow } from '../Eyebrow'
import { SpeedPlot } from './SpeedPlot'
import { getSpeedGain } from './speedGain'

export function PriceOfSpeedSection({
  speed,
}: {
  speed: PriceOfSpeed | undefined
}) {
  if (!speed) {
    return (
      <section className="flex flex-col gap-2">
        <Eyebrow>Price of speed</Eyebrow>
        <p className="text-secondary text-sm">
          No complete days of mempool data in the past year.
        </p>
      </section>
    )
  }
  const { period } = speed
  const gain = getSpeedGain(speed)
  return (
    <section className="flex flex-col gap-3">
      <Eyebrow
        infoLabel="About the price of speed"
        info="Seconds until you can be 99% sure you’re in, against what the tip adds to the cost of an ERC-20 transfer."
      >
        Price of speed{DOT_SEPARATOR}
        {formatDays(period.from, period.to)}
      </Eyebrow>
      {gain && (
        <p className="text-secondary text-sm">
          <span className="mr-3 inline-block whitespace-nowrap font-bold text-4xl text-brand-deep tabular-nums tracking-tight">
            +{formatUsd(gain.extraUsd)}
          </span>
          <span>
            a transfer tipping 2 gwei instead of our estimated fast tip gets you
            in <strong className="font-bold text-primary">{gain.gain}</strong>:{' '}
            {gain.waits}, 99% sure
          </span>
        </p>
      )}
      <SpeedPlot speed={speed} />
      <p className="text-2xs text-secondary">
        {formatDays(period.from, period.to)}
        {period.missingDays > 0 &&
          `, without ${pluralDays(period.missingDays)} of incomplete data`}
        . Each dot is the transactions in one narrow tip range. Each block you
        miss adds 12 seconds.
      </p>
    </section>
  )
}
