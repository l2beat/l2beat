import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { MAX_SELECTED_CHAINS } from '~/pages/interop/components/flows/consts'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import type { GetFlowsGraphCaption } from '~/pages/interop/components/flows/graph/types'
import { FlowsGraphContext } from '~/pages/interop/components/flows/graph/utils/FlowsGraphContext'
import { useScaledParticleCounts } from '~/pages/interop/components/flows/graph/utils/useScaledParticleCounts'
import type { DaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { useTRPC } from '~/trpc/React'
import { buildDaFlowsGraph, OTHERS_ID } from './buildDaFlowsGraph'
import { DaFlowsPosters } from './DaFlowsPosters'
import { DaFlowsStats } from './DaFlowsStats'
import { getDaFlowsUnit, TIME_SCALE } from './daFlowsUnit'
import { formatPosted } from './formatPosted'

const getCaption: GetFlowsGraphCaption = (node) =>
  node ? { text: formatPosted(node.totalVolume), tone: 'neutral' } : undefined

export function DaFlowsCard({ daLayer, projects }: DaFlowsProjects) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.da.flows.queryOptions({ daLayerId: daLayer.id }),
  )

  const unit = getDaFlowsUnit(daLayer.id)

  const graph = useMemo(
    () =>
      data
        ? buildDaFlowsGraph(
            daLayer,
            projects,
            data,
            // the DA layer takes the middle, so the whole ring is free
            MAX_SELECTED_CHAINS,
          )
        : undefined,
    [data, daLayer, projects],
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
          [daLayer.id, ...projects.map((p) => p.id)].slice(
            0,
            MAX_SELECTED_CHAINS + 1,
          ),
    [graph, daLayer.id, projects],
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

  return (
    <FlowsGraphContext.Provider
      value={{
        selectedChains: chainIds,
        highlightedChains: highlighted ? [highlighted] : [],
        toggleHighlightedChain,
      }}
    >
      <PrimaryCard className="grid grid-cols-1 gap-4 max-md:mt-4 md:mt-6 lg:grid-cols-[240px_1fr_280px]">
        <div className="h-full max-lg:order-3">
          <DaFlowsStats
            daLayerName={daLayer.name}
            graph={graph}
            bytesPerParticle={valuePerParticle}
            unit={unit}
            isLoading={isLoading}
          />
        </div>
        <div className="flex min-w-0 flex-col lg:min-h-[38rem]">
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
            className="pt-4"
            maxSizeClassName="max-w-[max(min(70svh,calc(100svh-20rem)),30rem)] lg:h-full lg:w-auto lg:max-w-full"
          />
        </div>
        <div className="min-w-0 max-lg:order-2">
          <DaFlowsPosters
            posters={graph?.posters}
            isLoading={isLoading}
            highlighted={highlighted}
            unit={unit}
            // posters without a bubble of their own are part of "Others"
            getNodeId={(id) => (ringIds.has(id) ? id : OTHERS_ID)}
            onSelect={toggleHighlightedChain}
          />
        </div>
      </PrimaryCard>
    </FlowsGraphContext.Provider>
  )
}
