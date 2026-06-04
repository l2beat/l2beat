import { MainPageHeader } from '~/components/MainPageHeader'
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
      </SideNavLayout>
    </AppLayout>
  )
}
