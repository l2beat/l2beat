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
import { IntentBridgeCompareContent } from './components/comparison/IntentBridgeCompareContent'
import { IntentBridgeDominanceContent } from './components/dominance/IntentBridgeDominanceContent'
import { IntentBridgesTable } from './components/table/IntentBridgesTable'
import { IntentTopTokensWidget } from './components/top-tokens/IntentTopTokensWidget'
import type { InteropIntentBridge } from './getInteropIntentBridgesData'

const TOTALS_DESCRIPTION = 'Across all intent bridges'

interface Props extends AppLayoutProps {
  intentBridges: InteropIntentBridge[]
  interopChains: InteropChainWithIcon[]
  queryState: DehydratedState
}

export function InteropIntentBridgesPage({
  intentBridges,
  interopChains,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <IntentBridgesContent
          intentBridges={intentBridges}
          interopChains={interopChains}
        />
      </HydrationBoundary>
    </AppLayout>
  )
}

function IntentBridgesContent({
  intentBridges,
  interopChains,
}: {
  intentBridges: InteropIntentBridge[]
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
    trpc.interop.intentBridges.queryOptions(selection),
  )

  const [speedSrc, setSpeedSrc] = useState(TRANSFER_SPEED_DEFAULT_FROM)
  const [speedDst, setSpeedDst] = useState(TRANSFER_SPEED_DEFAULT_TO)
  const { data: speedData, isLoading: isSpeedLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
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
      <MainPageHeader description="This dashboard provides an overview of intent-based bridge protocols. It combines indexed transfer activity with curated intent-specific properties such as user recovery paths, solver access, settlement model, active tokens and active chain routes.">
        Intent bridges
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
      <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
        <InteropTotalVolumeWidget
          totalVolume={data?.activity.totalVolume}
          isLoading={isLoading}
          description={TOTALS_DESCRIPTION}
          mobile
        />
        <InteropTotalTransfersWidget
          totalTransfers={data?.activity.totalTransferCount}
          isLoading={isLoading}
          description={TOTALS_DESCRIPTION}
          mobile
        />
      </div>
      <div className="md:mt-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <div className="flex flex-col md:col-span-2 md:gap-4">
          <InteropDominanceCompareCard
            name="intentBridgesMode"
            dominanceLabel="Bridge Dominance"
            className="border-divider max-md:border-b"
            dominanceClassName="mt-2 lg:h-188 lg:flex-none"
            compareClassName="mt-2 lg:h-188 lg:flex-none"
            dominance={
              <IntentBridgeDominanceContent
                intentBridges={intentBridges}
                data={data}
                isLoading={isLoading}
              />
            }
            compare={
              <IntentBridgeCompareContent
                intentBridges={intentBridges}
                data={data}
                isLoading={isLoading}
              />
            }
          />
          <div className="grid grid-cols-2 gap-4 max-md:hidden">
            <InteropTotalVolumeWidget
              totalVolume={data?.activity.totalVolume}
              isLoading={isLoading}
              description={TOTALS_DESCRIPTION}
            />
            <InteropTotalTransfersWidget
              totalTransfers={data?.activity.totalTransferCount}
              isLoading={isLoading}
              description={TOTALS_DESCRIPTION}
            />
          </div>
        </div>
        <div className="flex flex-col md:col-span-2 md:gap-4 lg:h-0 lg:min-h-full">
          <IntentTopTokensWidget
            intentBridges={intentBridges}
            data={data}
            isLoading={isLoading}
            transfer={transfer}
          />
          <InteropTransferSpeedWidget
            entities={intentBridges.map((bridge) => ({
              id: bridge.id,
              slug: bridge.slug,
              iconUrl: bridge.iconUrl,
              color: bridge.color,
              label: bridge.name,
            }))}
            interopChains={interopChains}
            src={speedSrc}
            dst={speedDst}
            onSrcChange={setSpeedSrc}
            onDstChange={setSpeedDst}
            entries={speedData?.activity.entries}
            isLoading={isSpeedLoading}
            description="Select two chains to compare intent bridge transfer speed."
            listHeading="All intent bridges"
            className="lg:min-h-0 lg:flex-1"
            scrollClassName="max-h-56 pr-3 lg:max-h-none lg:min-h-0"
          />
        </div>
      </div>
      <HorizontalSeparator className="md:my-4" />
      <InteropTransferSizeCard
        data={data?.transferSizeChartData}
        isLoading={isLoading}
        className="h-75"
        categoryAxisWidth={130}
      />
      <HorizontalSeparator className="md:my-4" />
      <IntentBridgesTable
        intentBridges={intentBridges}
        data={data}
        isLoading={isLoading}
        transfer={transfer}
      />
    </SideNavLayout>
  )
}
