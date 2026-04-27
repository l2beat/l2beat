import {
  assert,
  type InteropBridgeType,
  type ProjectId,
} from '@l2beat/shared-pure'
import React from 'react'
import { Badge } from '~/components/badge/Badge'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { BridgeTypeBadge } from '~/pages/interop/components/table/BridgeTypeBadge'
import { FlowItem } from '~/pages/interop/components/widgets/FlowsWidget'
import { INTEROP_TYPE_TO_BG_COLOR } from '~/pages/interop/utils/display'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import type { ByBridgeTypeData } from '~/server/features/scaling/interop/types'
import type { InteropFlowData } from '~/server/features/scaling/interop/utils/getFlows'
import { api } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropVolumeSectionProps extends ProjectSectionProps {
  projectId: ProjectId
}

const bridgeTypeLabels: Record<keyof ByBridgeTypeData, string> = {
  lockAndMint: 'Lock & Mint',
  nonMinting: 'Non-minting',
  burnAndMint: 'Burn & Mint',
  unknown: 'Unknown',
}

const bridgeTypeColors: Record<InteropBridgeType | 'total', string> = {
  total: 'bg-purple-100',
  ...INTEROP_TYPE_TO_BG_COLOR,
}

export function InteropVolumeSection({
  projectId,
  ...sectionProps
}: InteropVolumeSectionProps) {
  const { selectionForApi, getChainById } = useInteropSelectedChains()
  const { data } = api.interop.protocol.useQuery({
    ...selectionForApi,
    id: projectId,
  })

  const entry = data?.entry
  const availableBridgeTypes = entry?.bridgeTypes ?? []

  const getChainDetails = (id: string) => {
    const chain = getChainById(id)
    assert(chain, `Chain not found: ${id}`)
    return chain
  }

  const bridgeTypesWithFlows = (
    [...availableBridgeTypes, 'unknown'] as const
  ).filter((type) => {
    const flows = entry?.byBridgeType?.[type]?.flows
    return flows !== undefined && flows.length > 0
  })

  const breakdownValues = bridgeTypesWithFlows.map((type) => ({
    value: entry?.byBridgeType?.[type]?.volume ?? 0,
    className: bridgeTypeColors[type],
  }))
  const breakdownTotal = breakdownValues.reduce(
    (sum, value) => sum + value.value,
    0,
  )

  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-2xs text-secondary uppercase">
            Volume
          </div>
          <div className="flex flex-col gap-1.5">
            <Breakdown className="h-[5px] w-full" values={breakdownValues} />
            <div className="flex flex-wrap gap-2.5">
              {bridgeTypesWithFlows.map((type) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'size-2 rounded-full',
                      bridgeTypeColors[type],
                    )}
                  />
                  <span className="font-medium text-paragraph-12 text-secondary leading-none">
                    {bridgeTypeLabels[type]}
                  </span>
                  <span className="font-bold text-paragraph-12 leading-none">
                    {formatCurrency(
                      entry?.byBridgeType?.[type]?.volume ?? 0,
                      'usd',
                    )}
                  </span>
                  <span className="font-bold text-paragraph-12 text-secondary leading-none">
                    (
                    {formatPercent(
                      breakdownTotal === 0
                        ? 0
                        : (entry?.byBridgeType?.[type]?.volume ?? 0) /
                            breakdownTotal,
                    )}
                    )
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:gap-3">
          {bridgeTypesWithFlows.length > 1 && (
            <FlowSection
              title="TOTAL"
              badge={
                <Badge size="extraSmall" className="text-white" type="purple">
                  TOTAL
                </Badge>
              }
              flows={data?.flows}
              getChainDetails={getChainDetails}
              className="md:flex-1"
            />
          )}
          {bridgeTypesWithFlows.map((type) => (
            <FlowSection
              key={type}
              title={bridgeTypeLabels[type].toUpperCase()}
              badge={<BridgeTypeBadge size="extraSmall" bridgeType={type} />}
              flows={entry?.byBridgeType?.[type]?.flows}
              getChainDetails={getChainDetails}
              className="md:flex-1"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 rounded-lg bg-surface-secondary p-4 md:grid-cols-3 md:gap-4 md:p-6">
          <StatsItem
            title="Total volume"
            value={formatCurrency(entry?.volume ?? 0, 'usd')}
          />
          <StatsItem
            title="Transfers count"
            value={formatInteger(entry?.transferCount ?? 0)}
          />
          <StatsItem
            title="Avg. transfer size"
            value={formatCurrency(entry?.averageValue ?? 0, 'usd')}
          />
        </div>
      </div>
    </ProjectSection>
  )
}

function FlowSection({
  badge,
  flows,
  getChainDetails,
  className,
}: {
  title: string
  badge: React.ReactNode
  flows: InteropFlowData[] | undefined
  getChainDetails: (id: string) => { id: string; iconUrl: string }
  className?: string
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="mb-3 flex items-center gap-1.5">
        {badge}
        <span className="font-medium text-paragraph-15 leading-none">
          flows
        </span>
      </div>
      <div className="flex h-22 items-stretch rounded-lg border border-divider md:h-52 md:flex-col md:p-2">
        {(!flows || flows.length === 0) && (
          <div className="flex h-full flex-1 items-center justify-center text-secondary text-xs">
            No data
          </div>
        )}
        {flows?.map((flow, i) => (
          <React.Fragment key={flow.srcChain + flow.dstChain}>
            {i > 0 && (
              <div className="flex items-center justify-center p-2 md:px-0">
                <div className="h-full w-px bg-divider md:h-px md:w-full" />
              </div>
            )}
            <FlowItem
              from={getChainDetails(flow.srcChain)}
              to={getChainDetails(flow.dstChain)}
              volume={flow.volume}
              className="flex-1 justify-center border-none p-2 md:py-2"
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function StatsItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col items-start max-md:flex-row max-md:items-center max-md:justify-between">
      <span className="font-medium text-secondary text-xs md:mb-1">
        {title}
      </span>
      <span className="font-medium text-primary text-sm xs:text-lg md:font-bold">
        {value}
      </span>
    </div>
  )
}
