import {
  assert,
  type KnownInteropBridgeType,
  type ProjectId,
} from '@l2beat/shared-pure'
import times from 'lodash/times'
import { useState } from 'react'
import { FlowItem } from '~/pages/interop/components/widgets/FlowsWidget'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import type {
  ByBridgeTypeData,
  ProtocolEntry,
} from '~/server/features/scaling/interop/types'
import type { InteropFlowData } from '~/server/features/scaling/interop/utils/getFlows'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { Skeleton } from '../../../core/Skeleton'
import { Tabs, TabsList, TabsTrigger } from '../../../core/Tabs'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropVolumeSectionProps extends ProjectSectionProps {
  projectId: ProjectId
}

const bridgeTypeLabels: Record<keyof ByBridgeTypeData, string> = {
  lockAndMint: 'Lock & Mint',
  nonMinting: 'Non-minting',
  burnAndMint: 'Burn & Mint',
}

type SelectedType = 'all' | KnownInteropBridgeType

export function InteropVolumeSection({
  projectId,
  ...sectionProps
}: InteropVolumeSectionProps) {
  const { selectionForApi, getChainById } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.protocol.useQuery({
    ...selectionForApi,
    id: projectId,
  })
  const [selectedType, setSelectedType] = useState<SelectedType>('all')

  const entry = data?.entry
  const availableBridgeTypes = entry?.bridgeTypes ?? []
  const activeData = getActiveData(entry, data?.flows ?? [], selectedType)

  const getChainDetails = (id: string) => {
    const chain = getChainById(id)
    assert(chain, `Chain not found: ${id}`)
    return chain
  }

  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col gap-4">
        {!isLoading ? (
          <Tabs
            name="bridgeType"
            value={selectedType}
            onValueChange={(v) => setSelectedType(v as SelectedType)}
            variant="highlighted"
          >
            <TabsList className="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              {availableBridgeTypes.map((type) => (
                <TabsTrigger key={type} value={type}>
                  {bridgeTypeLabels[type]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <Skeleton className="h-10 w-full" />
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          {isLoading &&
            times(2).map((index) => (
              <Skeleton key={index} className="h-20 w-full md:h-40" />
            ))}
          {activeData.flows?.map((flow) => (
            <FlowItem
              key={flow.srcChain + flow.dstChain}
              from={getChainDetails(flow.srcChain)}
              to={getChainDetails(flow.dstChain)}
              volume={flow.volume}
              className="md:py-11"
            />
          ))}
        </div>

        <div className="grid grid-cols-3 rounded-lg bg-surface-secondary p-6">
          <StatsItem
            title="Total volume"
            value={formatCurrency(activeData.volume, 'usd')}
            isLoading={isLoading}
          />
          <StatsItem
            title="Transfers count"
            value={formatInteger(activeData.transferCount)}
            isLoading={isLoading}
          />
          <StatsItem
            title="Avg. transfer size"
            value={formatCurrency(activeData.averageValue, 'usd')}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ProjectSection>
  )
}

interface ActiveData {
  volume: number
  transferCount: number
  averageValue: number
  flows: InteropFlowData[]
}

function getActiveData(
  entry: ProtocolEntry | undefined,
  topLevelFlows: InteropFlowData[],
  selectedType: 'all' | KnownInteropBridgeType,
): ActiveData {
  const empty: ActiveData = {
    volume: 0,
    transferCount: 0,
    averageValue: 0,
    flows: [],
  }

  if (!entry) return empty

  if (selectedType === 'all') {
    return {
      volume: entry.volume,
      transferCount: entry.transferCount,
      averageValue: entry.averageValue ?? 0,
      flows: topLevelFlows,
    }
  }

  const bridgeData = entry.byBridgeType?.[selectedType]
  if (!bridgeData) return empty

  return {
    volume: bridgeData.volume,
    transferCount: bridgeData.transferCount,
    averageValue: bridgeData.averageValue ?? 0,
    flows: bridgeData.flows,
  }
}

function StatsItem({
  title,
  value,
  isLoading,
}: {
  title: string
  value: string
  isLoading: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-paragraph-12 text-secondary leading-[1.25]">
        {title}
      </span>
      {isLoading ? (
        <Skeleton className="h-5 w-20" />
      ) : (
        <span className="font-bold text-label-value-16 leading-none">
          {value}
        </span>
      )}
    </div>
  )
}
