import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import {
  getExistingRelationGraphSelection,
  NODE_COLORS,
  RELATION_COLORS,
  type RelationGraph,
  type RelationGraphNode,
  type RelationGraphSelection,
} from './relationGraphModel'
import { TokenRelationsGraph } from './TokenRelationsGraph'
import { TokenRelationsGraphDetailsPanel } from './TokenRelationsGraphDetailsPanel'
import { TokenRelationsGraphSearch } from './TokenRelationsGraphSearch'

export function TokenRelationsGraphPage() {
  const trpc = useTRPC()
  const [selection, setSelection] = useState<RelationGraphSelection>()
  const [zoomTarget, setZoomTarget] = useState<{ nodeId: string }>()
  const [highlightAnomalies, setHighlightAnomalies] = useState(false)
  const graphQuery = useQuery(
    trpc.deployedTokens.getRelationsGraph.queryOptions(),
  )
  const chainsQuery = useQuery(trpc.chains.getAll.queryOptions())
  const graph = graphQuery.data
  const graphSelection =
    graph === undefined
      ? undefined
      : getExistingRelationGraphSelection(graph, selection)
  const graphZoomTarget =
    graph !== undefined &&
    zoomTarget !== undefined &&
    graph.nodes.some((node) => node.id === zoomTarget.nodeId)
      ? zoomTarget
      : undefined

  function selectSearchResult(node: RelationGraphNode) {
    setSelection({ type: 'node', id: node.id })
    setZoomTarget({ nodeId: node.id })
  }

  function changeSelection(selection: RelationGraphSelection | undefined) {
    setSelection(selection)
    setZoomTarget(undefined)
  }

  useEffect(() => {
    if (
      graph !== undefined &&
      selection !== undefined &&
      graphSelection === undefined
    ) {
      setSelection(undefined)
      setZoomTarget(undefined)
    }
  }, [graph, graphSelection, selection])

  return (
    <AppLayout className="min-h-svh">
      <div className="flex h-[calc(100vh-1rem)] flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-semibold text-xl">Token Relations Graph</h1>
            <div className="text-muted-foreground text-sm">
              {graph
                ? graphSummary(graph)
                : graphQuery.isError
                  ? 'Graph unavailable'
                  : 'Loading graph data'}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs">
            {graph && (
              <TokenRelationsGraphSearch
                nodes={graph.nodes}
                onSelect={selectSearchResult}
              />
            )}
            <GraphLegend />
            <AnomalySwitch
              checked={highlightAnomalies}
              onCheckedChange={setHighlightAnomalies}
            />
          </div>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border bg-background">
          {graphQuery.isError ? (
            <div className="grid h-full place-items-center p-4 text-center text-destructive text-sm">
              {graphQuery.error.message}
            </div>
          ) : graphQuery.isLoading || graph === undefined ? (
            <LoadingState className="h-full" />
          ) : graph.nodes.length === 0 ? (
            <div className="grid h-full place-items-center text-muted-foreground text-sm">
              No token relations.
            </div>
          ) : (
            <TokenRelationsGraph
              graph={graph}
              selection={graphSelection}
              zoomTarget={graphZoomTarget}
              highlightAnomalies={highlightAnomalies}
              onSelectionChange={changeSelection}
            />
          )}
          {graph && graphSelection && (
            <TokenRelationsGraphDetailsPanel
              graph={graph}
              chains={chainsQuery.data ?? []}
              selection={graphSelection}
              highlightAnomalies={highlightAnomalies}
              onSelectionChange={changeSelection}
              onClose={() => changeSelection(undefined)}
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
      <LegendDot color={NODE_COLORS.deployed} label="Deployed" />
      <LegendDot color={NODE_COLORS.missing} label="Missing" />
      <LegendLine color={RELATION_COLORS.burnAndMint} label="Burn & Mint" />
      <LegendLine color={RELATION_COLORS.lockAndMint} label="Lock & Mint" />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

function LegendLine({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-0.5 w-5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

function AnomalySwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={cn(
          'relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-destructive' : 'bg-muted-foreground/35',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </span>
      Highlight anomalies
    </button>
  )
}

function graphSummary(graph: RelationGraph) {
  const deployed = graph.nodes.filter((node) => node.isDeployed).length
  const missing = graph.nodes.length - deployed
  return `${deployed} deployed tokens, ${missing} missing endpoints, ${graph.relations.length} relations`
}
