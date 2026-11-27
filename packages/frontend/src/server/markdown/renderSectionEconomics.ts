import type { EconomicsSectionProps } from '~/components/projects/sections/economics/EconomicsSection'
import {
  sliceRange,
  summarize,
} from '~/components/projects/sections/economics/economics'
import {
  formatEth,
  formatSignedEth,
  formatSignedShare,
} from '~/components/projects/sections/economics/format'
import { formatTimestamp } from '~/utils/dates'
import { bulletList, joinBlocks } from './markdown'
import { renderLiquidStakingSection } from './renderSectionLiquidStaking'
import { htmlPagePointer } from './renderSectionParts'

/** The headline numbers; the charts stay on the HTML page. */
export function renderEconomicsSection({
  id,
  ethSupply,
  liquidStaking,
}: Pick<EconomicsSectionProps, 'id' | 'ethSupply' | 'liquidStaking'>) {
  const last = ethSupply.days.at(-1)
  const past30d = summarize(sliceRange(ethSupply.days, '30d'))
  return joinBlocks([
    htmlPagePointer(
      'Charts of ETH supply, issuance, burn and staking are shown',
      id,
    ),
    last
      ? bulletList([
          `Total supply: ${formatEth(last.totalSupply)} ETH (end of ${formatTimestamp(last.timestamp)} UTC)`,
          `Past 30 days: ${formatEth(past30d.issued)} ETH issued, ${formatEth(past30d.burned)} ETH burned, net ${formatSignedEth(past30d.net)} ETH (${formatSignedShare(past30d.annualizedRate)} per year)`,
        ])
      : '',
    liquidStaking ? renderLiquidStakingSection(liquidStaking) : '',
  ])
}
