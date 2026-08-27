import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import {
  filterTokensWithoutRelations,
  getExistingRelationGraphSelection,
  NODE_COLORS,
  RELATION_COLORS,
  type RelationGraph,
  type RelationGraphNode,
  type RelationGraphSelection,
  relationId,
  type TokensWithoutRelationsDisplayMode,
} from './relationGraphModel'
import { TokenRelationsGraph } from './TokenRelationsGraph'
import { TokenRelationsGraphDetailsPanel } from './TokenRelationsGraphDetailsPanel'
import { TokenRelationsGraphSearch } from './TokenRelationsGraphSearch'

export function TokenRelationsGraphPage() {
  const trpc = useTRPC()
  const [selection, setSelection] = useState<RelationGraphSelection>()
  const [zoomTarget, setZoomTarget] = useState<{ nodeId: string }>()
  const [highlightAnomalies, setHighlightAnomalies] = useState(false)
  // Which tokens without relations are displayed. Unlike relation deletion,
  // this filters the payload before the scene is built, so changing it
  // re-runs the whole layout (and re-fits the camera) — hidden tokens must
  // not distort the force simulation of the clusters they would belong to.
  //
  // The rebuild blocks the main thread for seconds, so the graph renders
  // from a deferred copy of the mode: a click's urgent render paints the
  // switched radio and the loading overlay, and React's deferred re-render
  // then performs the blocking scene build (a useMemo inside
  // TokenRelationsGraph) and commits the new clusters together with the
  // overlay's removal. The radios are disabled while the copies differ, so
  // clicks cannot pile up faster than rebuilds finish. (An urgent update
  // landing mid-rebuild restarts the deferred render — rare with the overlay
  // up, and only ever a repeated build, never wrong state.)
  const [withoutRelationsMode, setWithoutRelationsMode] =
    useState<TokensWithoutRelationsDisplayMode>('supported')
  const appliedWithoutRelationsMode = useDeferredValue(withoutRelationsMode)
  const isRelayouting = appliedWithoutRelationsMode !== withoutRelationsMode
  // Relations deleted while this page is open. The graph payload is not
  // refetched on deletion (see PlanConfirmationDialog) and the layout is not
  // re-run — the deleted edges are simply hidden everywhere they would show.
  const [deletedRelationIds, setDeletedRelationIds] = useState<
    ReadonlySet<string>
  >(() => new Set())
  const graphQuery = useQuery(
    trpc.deployedTokens.getRelationsGraph.queryOptions(undefined, {
      // The layout takes seconds and must never re-run under the user, so
      // this query is never refetched automatically while the page is open.
      // A plan execution marks it stale without refetching active instances
      // (see PlanConfirmationDialog); window focus and reconnect must not
      // pick that staleness up either — only the next mount of this page
      // fetches fresh data.
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
  )
  const chainsQuery = useQuery(trpc.chains.getAll.queryOptions())
  const fullGraph = graphQuery.data
  const graph = useMemo(
    () =>
      fullGraph === undefined
        ? undefined
        : filterTokensWithoutRelations(fullGraph, appliedWithoutRelationsMode),
    [fullGraph, appliedWithoutRelationsMode],
  )
  const hiddenNodeCount =
    fullGraph !== undefined && graph !== undefined
      ? fullGraph.nodes.length - graph.nodes.length
      : 0
  const graphSelection =
    graph === undefined
      ? undefined
      : getExistingRelationGraphSelection(graph, selection, deletedRelationIds)
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

  function markRelationDeleted(relationId: string) {
    setDeletedRelationIds((previous) => new Set(previous).add(relationId))
    changeSelection(undefined)
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
                ? graphSummary(graph, deletedRelationIds, hiddenNodeCount)
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
            <TokensWithoutRelationsPicker
              value={withoutRelationsMode}
              disabled={isRelayouting}
              onChange={setWithoutRelationsMode}
            />
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
            <>
              <TokenRelationsGraph
                graph={graph}
                selection={graphSelection}
                zoomTarget={graphZoomTarget}
                highlightAnomalies={highlightAnomalies}
                deletedRelationIds={deletedRelationIds}
                onSelectionChange={changeSelection}
              />
              {isRelayouting && (
                <LoadingState className="absolute inset-0 z-10 h-full bg-background" />
              )}
            </>
          )}
          {graph && graphSelection && (
            <TokenRelationsGraphDetailsPanel
              graph={graph}
              chains={chainsQuery.data ?? []}
              selection={graphSelection}
              highlightAnomalies={highlightAnomalies}
              deletedRelationIds={deletedRelationIds}
              onSelectionChange={changeSelection}
              onRelationDeleted={markRelationDeleted}
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
      <LegendDot color={NODE_COLORS.deployed} label="No relations" hollow />
      <LegendLine color={RELATION_COLORS.burnAndMint} label="Burn & Mint" />
      <LegendLine color={RELATION_COLORS.lockAndMint} label="Lock & Mint" />
    </div>
  )
}

function LegendDot({
  color,
  label,
  hollow = false,
}: {
  color: string
  label: string
  hollow?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2 rounded-full"
        style={
          hollow ? { border: `1.5px solid ${color}` } : { background: color }
        }
      />
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

const TOKENS_WITHOUT_RELATIONS_MODES: {
  value: TokensWithoutRelationsDisplayMode
  label: string
  title: string
}[] = [
  {
    value: 'hide',
    label: 'Hide',
    title: 'Show no tokens without relations',
  },
  {
    value: 'supported',
    label: 'Show supported',
    title:
      'Show only tokens without relations on chains that appear in some relation — the chains interop transfers cover',
  },
  {
    value: 'all',
    label: 'Show all',
    title: 'Show every token without relations',
  },
]

/**
 * Chooses which tokens without relations (abstract token assigned, no
 * observed relations) the graph displays. Changing it rebuilds the layout,
 * so the clusters settle without the hidden nodes; the radios are disabled
 * while that rebuild runs.
 */
function TokensWithoutRelationsPicker({
  value,
  disabled,
  onChange,
}: {
  value: TokensWithoutRelationsDisplayMode
  disabled: boolean
  onChange: (value: TokensWithoutRelationsDisplayMode) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border bg-background px-2.5 py-1.5 font-medium',
        disabled && 'opacity-60',
      )}
    >
      <span className="text-muted-foreground">Tokens without relations:</span>
      {TOKENS_WITHOUT_RELATIONS_MODES.map((mode) => (
        <label
          key={mode.value}
          title={mode.title}
          className={cn(
            'inline-flex items-center gap-1.5',
            disabled ? 'cursor-wait' : 'cursor-pointer',
          )}
        >
          <input
            type="radio"
            name="tokens-without-relations-mode"
            className="accent-primary"
            disabled={disabled}
            checked={value === mode.value}
            onChange={() => onChange(mode.value)}
          />
          {mode.label}
        </label>
      ))}
    </div>
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

function graphSummary(
  graph: RelationGraph,
  deletedRelationIds: ReadonlySet<string>,
  hiddenNodeCount: number,
) {
  // The graph is already filtered by the without-relations display mode, so
  // these are displayed counts and change with the mode; the hidden count
  // says how many nodes the mode removed.
  const deployed = graph.nodes.filter((node) => node.isDeployed).length
  const withoutRelations = graph.nodes.filter(
    (node) => !node.hasRelations,
  ).length
  const missing = graph.nodes.length - deployed
  // Count by filtering rather than subtracting the deleted set's size: a
  // fresh payload no longer contains the deleted relations, and subtraction
  // would then remove them a second time.
  const relations = graph.relations.filter(
    (relation) => !deletedRelationIds.has(relationId(relation)),
  ).length
  const hidden = hiddenNodeCount > 0 ? `, ${hiddenNodeCount} hidden` : ''
  return `${deployed} deployed tokens (${withoutRelations} without relations), ${missing} missing endpoints, ${relations} relations${hidden}`
}
