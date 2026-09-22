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
import { getUnconnectedIds } from './graphSelectors'
import { RelationsDetails } from './RelationsDetails'
import { RelationsDiagram } from './RelationsDiagram'

export function TokenRelationsGraphView({
  graph,
}: {
  graph: InteropTokenRelationsGraph
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
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Legend />
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
          className="h-[380px] md:h-[520px]"
          onExpand={isMobile ? undefined : () => setIsExpanded(true)}
        />
      )}

      {isMobile && (
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
        <DialogContent className="inset-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 bg-surface-primary p-4 md:rounded-none">
          <DialogTitle className="pr-8">Onchain deployments</DialogTitle>
          <DialogDescription className="sr-only">
            A full-screen view of which deployments of this token back which
            others.
          </DialogDescription>
          <DialogClose />
          <DiagramPane
            {...paneProps}
            className="h-full"
            wrapperClassName="min-h-0 flex-1"
          />
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
  wrapperClassName,
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
  wrapperClassName?: string
}) {
  return (
    <div className={cn('relative', wrapperClassName)}>
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

function Legend() {
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
      <span className="flex items-center gap-2">
        <span className="-space-x-1.5 flex shrink-0">
          <span className="size-4 rounded-full border border-divider bg-surface-primary" />
          <span className="size-4 rounded-full border border-divider bg-surface-primary" />
        </span>
        Burn & mint cluster
      </span>
      <span className="flex items-center gap-2">
        <span className="size-4 shrink-0 rounded border border-divider border-dashed" />
        No observed relations
      </span>
    </div>
  )
}
