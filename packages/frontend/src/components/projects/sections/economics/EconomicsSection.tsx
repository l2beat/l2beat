import { useMemo, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import type { LiquidStakingOverview } from '~/server/features/defi/liquid-staking/getLiquidStakingOverview'
import type {
  EthSupplyOverview,
  LiveChain,
} from '~/server/features/eth-supply/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { BurnRateTile, OffsetTile } from './BurnTiles'
import { ChainTile } from './ChainTile'
import {
  type EconomicsRange,
  getFlowRows,
  RANGE_OPTIONS,
  rangeLabel,
  sliceRange,
  summarize,
} from './economics'
import { FlowsTile } from './FlowsTile'
import { LiquidStakingBlock } from './LiquidStakingBlock'
import { PriceTile } from './PriceTile'
import { RecordsTile } from './RecordsTile'
import { StakedShareTile } from './StakedShareTile'
import { StakingTile } from './StakingTile'
import { SupplyTile } from './SupplyTile'

export interface EconomicsSectionProps extends ProjectSectionProps {
  ethSupply: EthSupplyOverview
  /** Absent while DeFi pages are off */
  liquidStaking: LiquidStakingOverview | undefined
  /** Read per request, while the rest of the page is cached */
  initialChain?: LiveChain
}

export function EconomicsSection({
  ethSupply,
  liquidStaking,
  initialChain,
  ...sectionProps
}: EconomicsSectionProps) {
  const [range, setRange] = useState<EconomicsRange>('all')
  const { days } = ethSupply
  const windowDays = useMemo(() => sliceRange(days, range), [days, range])
  const summary = useMemo(() => summarize(windowDays), [windowDays])
  const summary30d = useMemo(() => summarize(sliceRange(days, '30d')), [days])
  const rows = useMemo(() => getFlowRows(windowDays), [windowDays])
  const label = rangeLabel(range, days)
  const last = days.at(-1)

  return (
    <ProjectSection {...sectionProps} className="pb-0 md:pb-0">
      <div className="economics flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="font-medium text-label-value-13 text-secondary">
            Daily data through {last ? formatTimestamp(last.timestamp) : '–'}{' '}
            UTC
          </span>
          <RadioGroup
            name="ethSupplyRange"
            value={range}
            onValueChange={(v) => setRange(v as EconomicsRange)}
            aria-label="Range"
          >
            {RANGE_OPTIONS.map((option) => (
              <RadioGroupItem key={option.value} value={option.value}>
                {option.label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>

        {/* The cells run to the card's edges under the header; its bottom
            corners clip them from md up, where the card is rounded. */}
        <div className="-mx-4 md:-mx-6">
          <div
            className={cn(
              'economics-bento',
              !initialChain && 'economics-bento-no-chain',
            )}
          >
            <SupplyTile
              days={days}
              windowDays={windowDays}
              summary={summary}
              summary30d={summary30d}
              range={range}
            />
            <OffsetTile summary={summary} rangeLabel={label} />
            <BurnRateTile summary={summary} rangeLabel={label} />
            <FlowsTile rows={rows} rangeLabel={label} />
            <RecordsTile days={days} />
            <PriceTile days={windowDays} rangeLabel={label} />
            <StakingTile
              staking={ethSupply.staking}
              liquidStaking={liquidStaking}
              supply={last?.totalSupply ?? 0}
            />
            <StakedShareTile
              staking={ethSupply.staking}
              from={windowDays[0]?.timestamp ?? 0}
              supply={last?.totalSupply ?? 0}
              rangeLabel={label}
            />
            {initialChain && <ChainTile initialChain={initialChain} />}
          </div>
        </div>
      </div>
      {liquidStaking && <LiquidStakingBlock liquidStaking={liquidStaking} />}
    </ProjectSection>
  )
}
