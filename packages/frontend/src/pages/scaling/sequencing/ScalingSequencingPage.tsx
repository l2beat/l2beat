import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingSequencingEntry } from '~/server/features/scaling/sequencing/getScalingSequencingEntries'
import { InclusionDelayComparisonChart } from './components/InclusionDelayComparisonChart'
import { ScalingSequencingTable } from './components/table/ScalingSequencingTable'

interface Props extends AppLayoutProps {
  entries: ScalingSequencingEntry[]
}

export function ScalingSequencingPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Decentralized sequencing or validating improves short-term censorship restistance compared to centralized sequencing. Actual inclusion delays under censorship depend on sequencer rotation, sampling method, stake distribution, and live non-censoring operators. Long-term censorship resistance is strongest when decentralized sequencing is paired with a deterministic host-chain path, such as forced inclusion from- or an escape hatch to Ethereum.">
          Sequencing
        </MainPageHeader>
        <TableSortingProvider initialSort={{ id: '#', desc: false }}>
          <ScalingSequencingTable entries={entries} />
        </TableSortingProvider>
        <InclusionDelayComparisonChart entries={entries} />
        <PrimaryCard className="mt-4 md:mt-6">
          <h2 className="font-bold text-heading-16 md:text-heading-20">
            Centralized sequencing
          </h2>
          <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
            A single operator controls transaction ordering and block
            production. This gives users fast confirmations and high transaction
            throughput in the best case, but adds risk of censorship: if the
            operator refuses to include a transaction, users must rely on
            fallback paths that are enforced by the proof system on the host
            chain and delay their transactions significantly.
          </p>
          <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
            Combining decentralized sequencing with deterministic censorship
            resistance gadgets that tap into Ethereum's decentralization results
            in an optimal mix of real-time and eventual censorship resistance.
          </p>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
