import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { EcosystemMonthlyUpdateEntry } from '../utils/getEcosystemEntries'

interface Props {
  tvsLeaderboard: EcosystemMonthlyUpdateEntry['tvsLeaderboard']
}

export function Leaderboards({ tvsLeaderboard: leaderboard }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <PrimaryCard className="!rounded-lg border border-divider">
        <div className="mb-3 font-bold text-xl">Top TVS Gainers</div>
        <div className="space-y-2">
          {leaderboard.gainers.map((item) => (
            <LeaderboardItem key={item.slug} item={item} />
          ))}
        </div>
        <div className="mt-6 mb-3 font-bold text-xl">Top TVS Leaders</div>
        <div className="space-y-2">
          {leaderboard.leaders.map((item) => (
            <LeaderboardItem key={item.slug} item={item} />
          ))}
        </div>
      </PrimaryCard>
      <PrimaryCard className="!rounded-lg border border-divider">
        <div className="mb-3 font-bold text-xl">Top TVS Gainers</div>
        <div className="space-y-2">
          {leaderboard.gainers.map((item) => (
            <LeaderboardItem key={item.slug} item={item} />
          ))}
        </div>
        <div className="mt-6 mb-3 font-bold text-xl">Top TVS Leaders</div>
        <div className="space-y-2">
          {leaderboard.leaders.map((item) => (
            <LeaderboardItem key={item.slug} item={item} />
          ))}
        </div>
      </PrimaryCard>
    </div>
  )
}

function LeaderboardItem({
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
