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
        <MainPageHeader description="Decentralized sequencing or validating improves short-term censorship restistance compared to centralized sequencing. Actual inclusion delays under censorship depend on sequencer rotation, sampling method, stake distribution, and live non-censoring operators. Long-term censorship resistance is strongest when paired with a deterministic host-chain path, such as forced inclusion from- or an escape hatch to Ethereum.">
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
