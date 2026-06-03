import { MainPageHeader } from '~/components/MainPageHeader'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingDecentralizedSequencingEntry } from '~/server/features/scaling/decentralized-sequencing/getScalingDecentralizedSequencingEntries'
import { InclusionDelayComparisonChart } from './components/InclusionDelayComparisonChart'
import { ScalingDecentralizedSequencingTable } from './components/table/ScalingDecentralizedSequencingTable'

interface Props extends AppLayoutProps {
  entries: ScalingDecentralizedSequencingEntry[]
}

export function ScalingDecentralizedSequencingPage({
  entries,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Compare projects where transaction ordering is handled by a decentralized sequencer or validator set. Short-term inclusion guarantees depend on rotation, sampling, stake distribution, and live non-censoring operators. Long-term censorship resistance is strongest when paired with a deterministic host-chain path, such as forced inclusion or an escape hatch.">
          Decentralized Sequencing
        </MainPageHeader>
        <TableSortingProvider initialSort={{ id: '#', desc: false }}>
          <ScalingDecentralizedSequencingTable entries={entries} />
        </TableSortingProvider>
        <InclusionDelayComparisonChart entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
