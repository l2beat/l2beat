import {
  type DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { useTRPC } from '~/trpc/React'
import { ChainsMultiSelect } from '../components/chain-selector/ChainsMultiSelect'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { useChainSelection } from '../components/chain-selector/useChainSelection'
import { InteropDominanceCompareCard } from '../components/InteropDominanceCompareCard'
import {
  InteropTotalTransfersWidget,
  InteropTotalVolumeWidget,
} from '../components/InteropTotalsWidgets'
import { InteropTransferSizeCard } from '../components/InteropTransferSizeCard'
import { InteropTransferSpeedWidget } from '../components/InteropTransferSpeedWidget'
import {
  TRANSFER_SPEED_DEFAULT_FROM,
  TRANSFER_SPEED_DEFAULT_TO,
} from '../components/transferSpeedDefaults'
import { FrameworkCompareContent } from './components/comparison/FrameworkCompareContent'
import { FrameworkDominanceContent } from './components/FrameworkDominanceContent'
import { FrameworksTable } from './components/frameworks-table/FrameworksTable'
import { TopTokensWidget } from './components/TopTokensWidget'
import type { InteropTokenFramework } from './getInteropTokenFrameworksData'

const TOTALS_DESCRIPTION = 'Across all frameworks'

interface Props extends AppLayoutProps {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
  queryState: DehydratedState
}

export function InteropTokenFrameworksPage({
  tokenFrameworks,
  interopChains,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TokenFrameworksContent
          tokenFrameworks={tokenFrameworks}
          interopChains={interopChains}
        />
      </HydrationBoundary>
    </AppLayout>
  )
}

function TokenFrameworksContent({
  tokenFrameworks,
  interopChains,
}: {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const { selectedChains, toggleChain, selectAll, deselectAll } =
    useChainSelection(interopChains)
  const selection = useMemo(
    () => ({ from: selectedChains, to: selectedChains }),
    [selectedChains],
  )

  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions(selection),
  )

  const [speedSrc, setSpeedSrc] = useState(TRANSFER_SPEED_DEFAULT_FROM)
  const [speedDst, setSpeedDst] = useState(TRANSFER_SPEED_DEFAULT_TO)
  const { data: speedData, isLoading: isSpeedLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: [speedSrc],
      to: [speedDst],
    }),
  )

  const transfer = useMemo(
    () => ({
      selection,
      snapshotTimestamp: data?.snapshotTimestamp,
    }),
    [selection, data?.snapshotTimestamp],
  )

  return (
    <SideNavLayout>
      <MainPageHeader description="This dashboard provides a comprehensive overview of the major token frameworks - multichain standards that can be used for token creation. The page uses cross-chain transfers data to provide insights on volume, transfers, tokens and speed across different chains.">
        Token frameworks
      </MainPageHeader>
      <div className="mt-4 max-md:bg-surface-primary max-md:p-4 max-md:pb-0">
        <ChainsMultiSelect
          allChains={interopChains}
          selectedChains={selectedChains}
          onToggle={toggleChain}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
      </div>
      <div className="grid md:mt-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-12">
        <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
          <InteropTotalVolumeWidget
            totalVolume={data?.frameworkDominance.volume.total}
            isLoading={isLoading}
            description={TOTALS_DESCRIPTION}
            mobile
          />
          <InteropTotalTransfersWidget
            totalTransfers={data?.frameworkDominance.transfers.total}
            isLoading={isLoading}
            description={TOTALS_DESCRIPTION}
            mobile
          />
        </div>
        <InteropDominanceCompareCard
          name="tokenFrameworksMode"
          dominanceLabel="Framework Dominance"
          className="border-divider max-md:border-b md:col-span-2 lg:row-span-10"
          dominanceClassName="mt-2"
          compareClassName="mt-2"
          dominance={
            <FrameworkDominanceContent
              tokenFrameworks={tokenFrameworks}
              frameworkDominance={data?.frameworkDominance}
              changePeriod={data?.changePeriod}
              isLoading={isLoading}
            />
          }
          compare={
            <FrameworkCompareContent
              tokenFrameworks={tokenFrameworks}
              frameworkDominance={data?.frameworkDominance}
              frameworkTable={data?.frameworkTable}
              isLoading={isLoading}
            />
          }
        />
        <TopTokensWidget
          tokenFrameworks={tokenFrameworks}
          data={data}
          isLoading={isLoading}
          transfer={transfer}
        />
        <InteropTransferSpeedWidget
          entities={tokenFrameworks.map((framework) => ({
            id: framework.id,
            slug: framework.slug,
            iconUrl: framework.iconUrl,
            color: framework.color,
            label: framework.label,
          }))}
          interopChains={interopChains}
          src={speedSrc}
          dst={speedDst}
          onSrcChange={setSpeedSrc}
          onDstChange={setSpeedDst}
          entries={speedData?.frameworkDominance.transfers.entries}
          isLoading={isSpeedLoading}
          description="Select two chains to compare cross-chain transfer speed."
          listHeading="All Frameworks"
          className="md:col-span-2 lg:col-start-3 lg:row-span-7 lg:row-start-6"
          scrollClassName="max-h-64.5"
        />
        <InteropTotalVolumeWidget
          totalVolume={data?.frameworkDominance.volume.total}
          isLoading={isLoading}
          description={TOTALS_DESCRIPTION}
          className="max-md:hidden lg:col-start-1 lg:row-span-2 lg:row-start-11"
        />
        <InteropTotalTransfersWidget
          totalTransfers={data?.frameworkDominance.transfers.total}
          isLoading={isLoading}
          description={TOTALS_DESCRIPTION}
          className="max-md:hidden lg:col-start-2 lg:row-span-2 lg:row-start-11"
        />
      </div>
      <HorizontalSeparator className="md:my-4" />
      <InteropTransferSizeCard
        data={data?.transferSizeChartData}
        isLoading={isLoading}
      />
      <HorizontalSeparator className="md:my-4" />
      <FrameworksTable
        tokenFrameworks={tokenFrameworks}
        data={data}
        isLoading={isLoading}
        transfer={transfer}
      />
    </SideNavLayout>
  )
}
