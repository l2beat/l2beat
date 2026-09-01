import { Callout } from '~/components/Callout'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import { InfoIcon } from '~/icons/Info'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type {
  InclusionDelayComparison,
  L2RiskCentralizedSequencingEntry,
  L2RiskSequencingEntry,
} from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'
import { CentralizedSequencingTable } from './components/centralized-table/CentralizedSequencingTable'
import { InclusionDelayComparisonChart } from './components/InclusionDelayComparisonChart'
import { L2RiskSequencingTable } from './components/table/L2RiskSequencingTable'

interface Props extends AppLayoutProps {
  decentralizedEntries: L2RiskSequencingEntry[]
  centralizedEntries: L2RiskCentralizedSequencingEntry[]
  inclusionDelayComparison: InclusionDelayComparison | undefined
}

export function L2RiskSequencingPage({
  decentralizedEntries,
  centralizedEntries,
  inclusionDelayComparison,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Rotating block production across independent operators improves real-time censorship resistance, while deterministic host-chain inclusion provides eventual censorship resistance. No system shown here combines both guarantees today.">
          Sequencing
        </MainPageHeader>
        <PrimaryCard className="mt-4">
          <TableSortingProvider initialSort={{ id: '#', desc: false }}>
            <L2RiskSequencingTable entries={decentralizedEntries} />
          </TableSortingProvider>
          {inclusionDelayComparison && (
            <InclusionDelayComparisonChart
              comparison={inclusionDelayComparison}
            />
          )}
        </PrimaryCard>
        <TableSortingProvider initialSort={{ id: '#', desc: false }}>
          <CentralizedSequencingTable entries={centralizedEntries} />
        </TableSortingProvider>
        <Callout
          color="blue"
          body="A system combining decentralized sequencing for real-time censorship resistance with deterministic L1 inclusion for eventual censorship resistance would provide the strongest overall protection. No live system shown here offers that combination yet."
          icon={<InfoIcon className="size-5" variant="blue" />}
          className="mt-6 p-4 font-medium text-paragraph-15 md:text-paragraph-16"
        />
      </SideNavLayout>
    </AppLayout>
  )
}
