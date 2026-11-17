import { formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  FLAG_TOKEN_MULTIPLIER,
  FLAG_TOKEN_VOLUME_USD,
  LANE_CAP_USD,
  MIN_TIMED_TRANSFERS,
  ZERO_DAY_MIN_USUAL_TRANSFERS,
} from '~/server/features/layer2s/interop/history/historyRules'
import { cn } from '~/utils/cn'
import type {
  HistoryCappedLane,
  HistoryExclusions,
  HistoryTokenDay,
} from '../utils/applyHistoryExclusions'
import type { HistoryZeroDay } from '../utils/findZeroDays'

interface Props {
  exclusions: HistoryExclusions
  setExclusions: (exclusions: HistoryExclusions) => void
  cappedLanes: HistoryCappedLane[]
  tokenDays: HistoryTokenDay[]
  zeroDays: HistoryZeroDay[]
  missingCount: number
  blockedCount: number
}

const usd = (value: number) => formatCurrency(value, 'usd', { decimals: 0 })
const total = (items: { volume: number }[]) =>
  items.reduce((sum, item) => sum + item.volume, 0)

export function HistoryExclusionsPanel({
  exclusions,
  setExclusions,
  cappedLanes,
  tokenDays,
  zeroDays,
  missingCount,
  blockedCount,
}: Props) {
  const toggle = (key: keyof HistoryExclusions) => (checked: boolean) =>
    setExclusions({ ...exclusions, [key]: checked })

  return (
    <PrimaryCard className="flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-heading-20">What looks wrong</h2>
        <p className="mt-1 text-label-value-13 text-secondary">
          Everything is shown and marked. Tick a kind to leave it out of volume
          and flows.
        </p>
      </div>

      <Mark
        color="bg-negative"
        title={`Lanes over ${usd(LANE_CAP_USD)} a day`}
        effect={`${cappedLanes.length} lane-days, ${usd(total(cappedLanes))}`}
        checked={exclusions.laneCap}
        onCheckedChange={toggle('laneCap')}
        name="historyExcludeLaneCap"
      >
        A lane is one protocol, bridge type, source and destination. No lane
        normally moves more than a few hundred million a day. The backend's
        promotion rule now blocks a snapshot with such a lane; history from
        before the rule was never checked.
      </Mark>

      <Mark
        color="bg-warning"
        title="Unusual token days"
        effect={`${tokenDays.length} token-days, ${usd(total(tokenDays))}`}
        checked={exclusions.tokenDays}
        onCheckedChange={toggle('tokenDays')}
        name="historyExcludeTokenDays"
      >
        A protocol's day of one token over {usd(FLAG_TOKEN_VOLUME_USD)} and{' '}
        {FLAG_TOKEN_MULTIPLIER}× its median over ±14 days, not counting lanes
        over the cap. It could be a price error or a real whale move.
      </Mark>

      <Mark
        color="bg-negative/40"
        title="Blocked snapshots"
        effect={`${blockedCount} snapshots`}
        checked={exclusions.blocked}
        onCheckedChange={toggle('blocked')}
        name="historyExcludeBlocked"
      >
        Snapshots the promotion rules rejected. The site never served them, but
        retention kept them as a day's history.
      </Mark>

      <Mark
        color="bg-secondary"
        title="Zero days"
        effect={`${zeroDays.length} protocol-days`}
      >
        A protocol with no transfers while it usually has at least{' '}
        {ZERO_DAY_MIN_USUAL_TRANSFERS.daily} a day. An indexer outage looks like
        this, but so does a paused bridge or a renamed plugin. Marked only: one
        protocol cannot be cut out of a total.
      </Mark>

      <Mark
        color="bg-surface-tertiary"
        title="Missing snapshots"
        effect={`${missingCount} points`}
      >
        No snapshot at all, for any protocol or chain. Always a gap, never a
        zero.
      </Mark>

      <p className="text-label-value-13 text-secondary">
        Transfer times need at least {MIN_TIMED_TRANSFERS} timed transfers for a
        point. Counts and times are never excluded.
      </p>
    </PrimaryCard>
  )
}

function Mark({
  color,
  title,
  effect,
  checked,
  onCheckedChange,
  name,
  children,
}: {
  color: string
  title: string
  effect: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  name?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={cn('size-2.5 shrink-0 rounded-full', color)} />
        <h3 className="font-bold text-heading-16">{title}</h3>
      </div>
      <p className="text-label-value-13 text-secondary">{children}</p>
      <p className="font-medium text-label-value-13">In this range: {effect}</p>
      {onCheckedChange && name && (
        <Checkbox
          name={name}
          checked={checked}
          onCheckedChange={(c) => onCheckedChange(c === true)}
          className="mt-1"
        >
          Exclude
        </Checkbox>
      )}
    </section>
  )
}
