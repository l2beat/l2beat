import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { LAST_UPDATED } from '../DonatePage'
import { FundingSourcesTable } from './FundingSourcesTable'

export function FundingSourcesSection() {
  return (
    <PrimaryCard className="border-divider border-t md:mt-6 md:border-t-0">
      <h2 className="font-bold text-xl">Funding sources</h2>
      <p className="mt-4 text-base leading-5">
        As a public goods company, L2BEAT is financed in the open by the
        community. For transparency, we are providing L2BEAT&apos;s funding
        sources below.
      </p>
      <FundingTierDescriptions />
      <FundingSourcesTable />
      <div className="mt-8 font-bold">Last updated: {LAST_UPDATED}</div>
    </PrimaryCard>
  )
}

function FundingTierDescriptions() {
  return (
    <div className="mt-6 text-base leading-normal">
      <p>
        Those funding sources have been categorized based on the contribution
        amounts:
      </p>
      <ul className="mt-2 ml-6 list-disc">
        <li>
          <strong>Significant</strong>: Above 500,000 USD
        </li>
        <li>
          <strong>Medium</strong>: Between 100,000 USD and 500,000 USD
        </li>
        <li>
          <strong>Small</strong>: Below 100,000 USD
        </li>
      </ul>
    </div>
  )
}
