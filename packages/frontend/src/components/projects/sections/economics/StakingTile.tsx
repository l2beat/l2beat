import { useMemo, useState } from 'react'
import { getProjectSeries } from '~/pages/defi/liquid-staking/components/LiquidStakingCharts'
import { formatYield } from '~/pages/defi/liquid-staking/formatLiquidStaking'
import type { LiquidStakingOverview } from '~/server/features/defi/liquid-staking/getLiquidStakingOverview'
import type { EthSupplyOverview } from '~/server/features/eth-supply/types'
import { formatTimestamp } from '~/utils/dates'
import { formatEthShort, formatShare } from './format'
import { Figure, Swatch, Tile, TileTitle, TYPE } from './ui'

const OTHER = 'var(--surface-tertiary)'

interface Part {
  key: string
  name: string
  share: number
  color: string
  icon?: string
}

/**
 * Staked ETH, its share of the supply and the network's yield, over the
 * supply as a bar: the staked part split across the tracked liquid staking
 * protocols (their shares are of the stake), then the part not staked.
 */
export function StakingTile({
  staking,
  liquidStaking,
  supply,
}: {
  staking: EthSupplyOverview['staking']
  liquidStaking: LiquidStakingOverview | undefined
  supply: number
}) {
  const [focus, setFocus] = useState<string | null>(null)
  const projectSeries = useMemo(
    () => getProjectSeries(liquidStaking?.entries ?? []),
    [liquidStaking],
  )

  if (!staking || supply <= 0) {
    return (
      <Tile area="staking" label="Staking">
        <TileTitle>Staking</TileTitle>
        <div className="font-medium text-label-value-14 text-secondary">
          No staking data
        </div>
      </Tile>
    )
  }

  const colorOf = new Map(projectSeries.map((s) => [s.key, s.color]))
  const protocols: Part[] = (liquidStaking?.entries ?? [])
    .flatMap((entry) =>
      entry.stakedEthShare
        ? [
            {
              key: entry.id,
              name: entry.shortName ?? entry.name,
              share: entry.stakedEthShare.value,
              color: colorOf.get(entry.id) ?? 'var(--secondary)',
              icon: entry.icon,
            },
          ]
        : [],
    )
    .sort((a, b) => b.share - a.share)
  const tracked = protocols.reduce((s, p) => s + p.share, 0)
  const parts: Part[] = [
    ...protocols,
    {
      key: 'other',
      name: 'Other stakers',
      share: Math.max(0, 1 - tracked),
      color: OTHER,
    },
  ]
  const stakedShare = Math.min(1, staking.ethStaked / supply)

  return (
    <Tile area="staking" label="Staking">
      <TileTitle meta={formatTimestamp(staking.timestamp)}>Staking</TileTitle>
      <div className="grid @lg:grid-cols-3 grid-cols-2 gap-x-6 gap-y-5">
        <Figure
          label="Staked"
          value={formatEthShort(staking.ethStaked)}
          unit="ETH"
        />
        <Figure
          label="Share of supply"
          value={formatShare(staking.ethStaked / supply)}
        />
        {staking.networkYield !== null && (
          <Figure
            label="Network yield"
            value={formatYield(staking.networkYield)}
            unit="/ yr"
          />
        )}
      </div>
      {protocols.length > 0 && (
        <div className="mt-auto flex flex-col gap-3 pt-1">
          <div className={TYPE.label}>
            Supply staked, by liquid staking protocol
          </div>
          <div
            role="img"
            aria-label={`${formatShare(stakedShare)} of the supply staked: ${parts.map((p) => `${p.name} ${formatShare(p.share)}`).join(', ')} of the stake`}
            className="flex h-4 gap-[2px]"
          >
            {parts.map((part) => (
              <span
                key={part.key}
                className="h-full min-w-[2px] transition-opacity duration-150 first:rounded-l-[4px]"
                style={{
                  width: `${part.share * stakedShare * 100}%`,
                  backgroundColor: part.color,
                  opacity: focus === null || focus === part.key ? 1 : 0.3,
                }}
              />
            ))}
            <span
              className="h-full flex-1 rounded-r-[4px] shadow-[inset_0_0_0_1px_var(--divider)]"
              style={{
                opacity: focus === null || focus === 'unstaked' ? 1 : 0.3,
              }}
            />
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {parts.map((part) => (
              <li
                key={part.key}
                className="flex items-center gap-1.5 whitespace-nowrap"
                onPointerEnter={() => setFocus(part.key)}
                onPointerLeave={() => setFocus(null)}
              >
                <span className="flex items-center gap-1.5 font-medium text-label-value-12 text-secondary">
                  <Swatch color={part.color} />
                  {part.icon && (
                    <img
                      src={part.icon}
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5 rounded-full"
                    />
                  )}
                  {part.name}
                </span>
                <span className="font-medium text-label-value-12 tabular-nums">
                  {formatShare(part.share)}
                </span>
              </li>
            ))}
            <li
              className="flex items-center gap-1.5 whitespace-nowrap font-medium text-label-value-12 text-secondary"
              onPointerEnter={() => setFocus('unstaked')}
              onPointerLeave={() => setFocus(null)}
            >
              <span className="size-2.5 shrink-0 rounded-[3px] shadow-[inset_0_0_0_1px_var(--divider)]" />
              Not staked
            </li>
          </ul>
        </div>
      )}
    </Tile>
  )
}
