import { CompareProjectsLink } from '~/pages/layer2s/compare/components/CompareProjectsLink'
import type { LiquidStakingOverview } from '~/server/features/defi/liquid-staking/getLiquidStakingOverview'
import {
  LIQUID_STAKING_COMPARE_HREF,
  LiquidStakingTable,
} from '../defi/LiquidStakingSection'

/** The liquid staking protocols table, under the old section's anchor. */
export function LiquidStakingBlock({
  liquidStaking,
}: {
  liquidStaking: LiquidStakingOverview
}) {
  return (
    <div id="liquid-staking" className="scroll-mt-16 pt-6 pb-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="whitespace-nowrap font-semibold text-heading-16">
          Liquid staking
        </h3>
        <CompareProjectsLink
          variant="section"
          href={LIQUID_STAKING_COMPARE_HREF}
        >
          Compare risks
        </CompareProjectsLink>
      </div>
      <LiquidStakingTable entries={liquidStaking.entries} />
    </div>
  )
}
