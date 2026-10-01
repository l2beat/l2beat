import { formatSeconds } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { MAX_SELECTED_CHAINS } from '~/pages/interop/components/flows/consts'
import { FlowsParticleLegend } from '~/pages/interop/components/flows/FlowsParticleLegend'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import type { GetFlowsGraphCaption } from '~/pages/interop/components/flows/graph/types'
import { FlowsGraphContext } from '~/pages/interop/components/flows/graph/utils/FlowsGraphContext'
import { useScaledParticleCounts } from '~/pages/interop/components/flows/graph/utils/useScaledParticleCounts'
import type { DaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { useTRPC } from '~/trpc/React'
import { buildDaFlowsGraph, OTHERS_ID } from './buildDaFlowsGraph'
import { DaFlowsPosters } from './DaFlowsPosters'
import { type DaFlowsUnit, getDaFlowsUnit, TIME_SCALE } from './daFlowsUnit'
import { formatPosted } from './formatPosted'

// A phone has room for the labels of this many bubbles, and no more
const SMALL_SCREEN_RING_SIZE = 7

const getCaption: GetFlowsGraphCaption = (node) =>
  node ? { text: formatPosted(node.totalVolume), tone: 'neutral' } : undefined

export function DaFlowsCard({
  daLayer,
  projects,
  detailsHref,
}: DaFlowsProjects & {
  /** Where the posting of every project is broken down further */
  detailsHref: string
}) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.da.flows.queryOptions({ daLayerId: daLayer.id }),
  )

  const unit = getDaFlowsUnit(daLayer.id)
  // the DA layer takes the middle, so the whole ring is free
  const ringSize =
    useBreakpoint() === 'xs' ? SMALL_SCREEN_RING_SIZE : MAX_SELECTED_CHAINS

  const graph = useMemo(
    () =>
      data
        ? buildDaFlowsGraph(
            daLayer,
            projects,
            data,
            ringSize,
            unit.minBatchSize,
          )
        : undefined,
    [data, daLayer, projects, ringSize, unit.minBatchSize],
  )

  const [highlighted, setHighlighted] = useState<string>()
  const toggleHighlightedChain = useCallback(
    (chainId: string) =>
      setHighlighted((current) => (current === chainId ? undefined : chainId)),
    [],
  )

  const chainIds = useMemo(
    () =>
      graph
        ? graph.nodes.map((node) => node.id)
        : // placeholders until the ranking is known
          [daLayer.id, ...projects.map((p) => p.id)].slice(0, ringSize + 1),
    [graph, daLayer.id, projects, ringSize],
  )

  const { valuePerParticle } = useScaledParticleCounts(
    chainIds,
    graph?.data.chainData,
    graph?.data.flows,
    undefined,
    { centerChainId: daLayer.id, scale: unit.scale, timeScale: TIME_SCALE },
  )

  const ringIds = useMemo(
    () => new Set(graph?.nodes.map((node) => node.id)),
    [graph],
  )
  // posters without a bubble of their own are part of "Others"
  const getNodeId = useCallback(
    (posterId: string) => (ringIds.has(posterId) ? posterId : OTHERS_ID),
    [ringIds],
  )

  return (
    <FlowsGraphContext.Provider
      value={{
        selectedChains: chainIds,
        highlightedChains: highlighted ? [highlighted] : [],
        toggleHighlightedChain,
      }}
    >
      <PrimaryCard className="grid grid-cols-1 gap-4 max-md:mt-4 md:mt-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col lg:h-[44rem]">
          <FlowsGraphPanel
            activeChains={graph?.nodes ?? []}
            data={graph?.data}
            hasEnoughChains
            hasEnoughProtocols
            isLoading={isLoading}
            centerChainId={daLayer.id}
            particleScale={unit.scale}
            timeScale={TIME_SCALE}
            getCaption={getCaption}
            className="pt-4 pb-4 max-md:pt-8 max-lg:order-none"
            // Above the list, the graph has the screen to itself once
            // scrolled to, so it may be as tall as the screen less the room
            // for the card and the legend. Beside the list, the labels beside
            // the ring need room outside its square
            maxSizeClassName="max-w-[max(calc(100svh-9rem),30rem)] lg:h-full lg:w-auto lg:max-w-[calc(100%-5rem)]"
          />
          <DaFlowsLegend
            totalPosted={graph?.totalPosted ?? 0}
            bytesPerParticle={valuePerParticle}
            unit={unit}
            isLoading={isLoading}
          />
        </div>
        <div className="min-w-0 lg:h-[44rem]">
          <DaFlowsPosters
            detailsHref={detailsHref}
            posters={graph?.posters}
            totalPosted={graph?.totalPosted}
            isLoading={isLoading}
            highlighted={highlighted}
            unit={unit}
            getNodeId={getNodeId}
            onSelect={toggleHighlightedChain}
          />
        </div>
      </PrimaryCard>
    </FlowsGraphContext.Provider>
  )
}

/** How to read the graph: what a particle and a burst stand for, and how fast it plays */
function DaFlowsLegend({
  totalPosted,
  bytesPerParticle,
  unit,
  isLoading,
}: {
  totalPosted: number
  bytesPerParticle: number | undefined
  unit: DaFlowsUnit
  isLoading: boolean
}) {
  if (isLoading) return null

  const particleLegend = (layout: 'inline' | 'stacked') => (
    <FlowsParticleLegend
      layout={layout}
      totalVolume={totalPosted}
      dollarsPerParticle={bytesPerParticle}
      unit={{
        label: 'data',
        format: formatPosted,
        formatParticle: unit.format,
      }}
    />
  )
  const timing = [
    <>
      1 burst ≈ <span className="font-bold text-brand">1 batch</span>
    </>,
    <>
      1 second ≈{' '}
      <span className="font-bold text-brand">
        {formatSeconds(TIME_SCALE, { fullUnit: true })}
      </span>
    </>,
  ]

  return (
    <>
      {/* One line where it fits. Wrapped, the separators would start lines */}
      <div className="flex items-center justify-center gap-x-2 font-medium text-label-value-12 text-secondary max-md:hidden">
        {particleLegend('inline')}
        {timing.map((item, i) => (
          <Fragment key={i}>
            <span className="text-tertiary">|</span>
            <span>{item}</span>
          </Fragment>
        ))}
      </div>
      <div className="space-y-1 text-center font-medium text-label-value-14 text-secondary md:hidden">
        {particleLegend('stacked')}
        {timing.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </>
  )
}
