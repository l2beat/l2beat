import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumber } from '~/utils/number-format/formatNumber'

interface Props {
  tvsLeaderboard: EcosystemMonthlyUpdateEntry['tvsLeaderboard']
  activityLeaderboard: EcosystemMonthlyUpdateEntry['activityLeaderboard']
}

export function Leaderboards({ tvsLeaderboard, activityLeaderboard }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <PrimaryCard className="!rounded-lg border border-divider">
        <div className="mb-3 font-bold text-xl">Top TVS Gainers</div>
        <div className="space-y-2">
          {tvsLeaderboard.gainers.map((item) => (
            <LeaderboardTvsItem key={item.slug} item={item} />
          ))}
        </div>
        <div className="mt-6 mb-3 font-bold text-xl">Top TVS Leaders</div>
        <div className="space-y-2">
          {tvsLeaderboard.leaders.map((item) => (
            <LeaderboardTvsItem key={item.slug} item={item} />
          ))}
        </div>
      </PrimaryCard>
      <PrimaryCard className="!rounded-lg border border-divider">
        <div className="mb-3 font-bold text-xl">Top UOPS Gainers</div>
        <div className="space-y-2">
          {activityLeaderboard.gainers.map((item) => (
            <LeaderboardActivityItem key={item.slug} item={item} />
          ))}
        </div>
        <div className="mt-6 mb-3 font-bold text-xl">Top UOPS Leaders</div>
        <div className="space-y-2">
          {activityLeaderboard.leaders.map((item) => (
            <LeaderboardActivityItem key={item.slug} item={item} />
          ))}
        </div>
      </PrimaryCard>
    </div>
  )
}

function LeaderboardTvsItem({
  item,
}: {
  item: EcosystemMonthlyUpdateEntry['tvsLeaderboard'][
    | 'gainers'
    | 'leaders'][number]
}) {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-2 flex gap-1.5">
        <img src={`/icons/${item.slug}.png`} className="size-5" />
        <span className="font-bold text-xs">{item.name}</span>
      </div>
      <PercentChange value={item.change} textClassName="font-semibold" />
      <div className="font-bold text-xs">{formatCurrency(item.tvs, 'usd')}</div>
    </div>
  )
}

function LeaderboardActivityItem({
  item,
}: {
  item: EcosystemMonthlyUpdateEntry['activityLeaderboard']['gainers'][number]
}) {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-2 flex gap-1.5">
        <img src={`/icons/${item.slug}.png`} className="size-5" />
        <span className="font-bold text-xs">{item.name}</span>
      </div>
      <PercentChange value={item.change} textClassName="font-semibold" />
      <div className="font-bold text-xs">{formatNumber(item.uops)}</div>
    </div>
  )
}
