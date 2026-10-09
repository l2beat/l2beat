import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '~/components/core/Drawer'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import type {
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import { getUnconnectedIds, isCluster } from './graphSelectors'
import { RelationsDetails } from './RelationsDetails'
import { RelationsDiagram } from './RelationsDiagram'

export function TokenRelationsGraphView({
  graph,
  diagramClassName = 'h-[380px] md:h-[520px]',
  embedded = false,
  className,
}: {
  graph: InteropTokenRelationsGraph
  diagramClassName?: string
  /** Inside a dialog already: no expand button, details inline instead of a drawer. */
  embedded?: boolean
  className?: string
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>()
  const [hideUnconnected, setHideUnconnected] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm'

  const unconnectedIds = useMemo(() => getUnconnectedIds(graph), [graph])
  const canHide = unconnectedIds.size > 0
  const visibleGraph = useMemo(
    () =>
      hideUnconnected && unconnectedIds.size > 0
        ? {
            ...graph,
            nodes: graph.nodes.filter((node) => !unconnectedIds.has(node.id)),
          }
        : graph,
    [graph, hideUnconnected, unconnectedIds],
  )
  const selectedNode = graph.nodes.find((node) => node.id === selectedNodeId)
  // The panel may point at a hidden deployment; selecting it brings it back.
  const selectNode = (id: string | undefined) => {
    if (id && unconnectedIds.has(id)) setHideUnconnected(false)
    setSelectedNodeId(id)
  }

  const closeDetails = () => setSelectedNodeId(undefined)
  const paneProps = {
    graph,
    visibleGraph,
    unconnectedIds,
    selectedNodeId,
    detailsNode: isMobile ? undefined : selectedNode,
    onSelectNode: selectNode,
    onCloseDetails: closeDetails,
  }

  return (
    <div className={className}>
      <div className="mb-3 flex min-h-8 flex-wrap items-center justify-between gap-2">
        <Legend
          hasClusters={graph.nodes.some(isCluster)}
          hasUnconnected={canHide && !hideUnconnected}
        />
        {canHide && (
          <Checkbox
            name="hideUnconnectedDeployments"
            checked={hideUnconnected}
            onCheckedChange={(checked) => setHideUnconnected(checked === true)}
          >
            Hide deployments with no relations
          </Checkbox>
        )}
      </div>

      {!isExpanded && (
        <DiagramPane
          {...paneProps}
          className={diagramClassName}
          onExpand={
            isMobile || embedded ? undefined : () => setIsExpanded(true)
          }
        />
      )}

      {isMobile && embedded && selectedNode && (
        <RelationsDetails
          graph={graph}
          node={selectedNode}
          onSelectNode={selectNode}
          onClose={closeDetails}
          className="mt-3 rounded-lg border border-divider"
        />
      )}

      {isMobile && !embedded && (
        <Drawer
          open={selectedNode !== undefined}
          onOpenChange={(open) => !open && closeDetails()}
        >
          <DrawerContent
            className="max-h-[85vh]"
            contentClassName="flex min-h-0 flex-1 flex-col px-0"
          >
            <DrawerTitle className="sr-only">Deployment details</DrawerTitle>
            <DrawerDescription className="sr-only">
              Activity and backing relations of the selected deployment.
            </DrawerDescription>
            {selectedNode && (
              <RelationsDetails
                graph={graph}
                node={selectedNode}
                onSelectNode={selectNode}
                className="min-h-0 flex-1"
                headerClassName="pt-0"
              />
            )}
          </DrawerContent>
        </Drawer>
      )}

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent
          className="flex flex-col gap-3 bg-surface-primary p-4"
          fullScreen
        >
          <DialogTitle className="pr-8">Onchain deployments</DialogTitle>
          <DialogDescription className="sr-only">
            A full-screen view of which deployments of this token back which
            others.
          </DialogDescription>
          <DialogClose />
          <DiagramPane {...paneProps} className="h-full" />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DiagramPane({
  graph,
  visibleGraph,
  unconnectedIds,
  selectedNodeId,
  detailsNode,
  onSelectNode,
  onCloseDetails,
  onExpand,
  className,
}: {
  graph: InteropTokenRelationsGraph
  visibleGraph: InteropTokenRelationsGraph
  unconnectedIds: ReadonlySet<string>
  selectedNodeId: string | undefined
  detailsNode: InteropTokenRelationsNode | undefined
  onSelectNode: (id: string | undefined) => void
  onCloseDetails: () => void
  onExpand?: () => void
  className: string
}) {
  // Fills a flex-column parent; a no-op in block flow.
  return (
    <div className="relative min-h-0 flex-1">
      <RelationsDiagram
        graph={visibleGraph}
        unconnectedIds={unconnectedIds}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
        onExpand={onExpand}
        className={className}
      />
      {detailsNode && (
        <aside className="absolute top-3 right-3 bottom-3 w-[min(88%,340px)]">
          <RelationsDetails
            graph={graph}
            node={detailsNode}
            onSelectNode={onSelectNode}
            onClose={onCloseDetails}
            className="overflow-hidden rounded-lg border border-divider shadow-xl"
          />
        </aside>
      )}
    </div>
  )
}

export function Legend({
  hasClusters = false,
  hasUnconnected = false,
}: {
  hasClusters?: boolean
  hasUnconnected?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-label-value-13 text-secondary">
      <span className="flex items-center gap-2">
        <svg width="26" height="8" aria-hidden className="shrink-0">
          <line
            x1="0"
            y1="4"
            x2="18"
            y2="4"
            className="stroke-primary/45"
            strokeWidth="1.75"
          />
          <path d="M 18 0 L 26 4 L 18 8 z" className="fill-primary/55" />
        </svg>
        Backs
      </span>
      {hasClusters && (
        <span className="flex items-center gap-2">
          <MiniCard rows={2} />
          Burn & mint cluster
        </span>
      )}
      {hasUnconnected && (
        <span className="flex items-center gap-2">
          <MiniCard rows={1} dashed />
          No observed relations
        </span>
      )}
    </div>
  )
}

function MiniCard({
  rows,
  dashed = false,
}: {
  rows: number
  dashed?: boolean
}) {
  return (
    <span
      className={cn(
        'flex w-7 shrink-0 flex-col justify-center gap-[3px] rounded-sm border border-divider bg-surface-primary px-1 py-[3px]',
        dashed && 'border-dashed',
      )}
    >
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="flex items-center gap-0.5">
          <span className="size-1 shrink-0 rounded-full bg-secondary/60" />
          <span className="h-px flex-1 rounded bg-secondary/40" />
        </span>
      ))}
    </span>
  )
}
