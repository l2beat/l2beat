import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import {
  Dialog,
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
import type { InteropTokenRelationsGraph } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
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

  const details = selectedNode && (
    <RelationsDetails
      graph={graph}
      node={selectedNode}
      onSelectNode={selectNode}
      onClose={() => setSelectedNodeId(undefined)}
    />
  )
  const diagram = (className: string, onExpand?: () => void) => (
    <div className="relative">
      <RelationsDiagram
        graph={visibleGraph}
        unconnectedIds={unconnectedIds}
        selectedNodeId={selectedNodeId}
        onSelectNode={selectNode}
        onExpand={onExpand}
        className={className}
      />
      {!isMobile && details && (
        <aside className="absolute top-3 right-3 bottom-3 w-[min(88%,340px)]">
          {details}
        </aside>
      )}
    </div>
  )

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

      {!isExpanded &&
        diagram(
          'h-[380px] md:h-[520px]',
          isMobile ? undefined : () => setIsExpanded(true),
        )}

      {isMobile && (
        <Drawer
          open={selectedNode !== undefined}
          onOpenChange={(open) => !open && setSelectedNodeId(undefined)}
        >
          <DrawerContent
            className="max-h-[85vh]"
            contentClassName="overflow-y-auto"
          >
            <DrawerTitle className="sr-only">Deployment details</DrawerTitle>
            <DrawerDescription className="sr-only">
              Activity and backing relations of the selected deployment.
            </DrawerDescription>
            {details}
          </DrawerContent>
        </Drawer>
      )}

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[min(1400px,95vw)] bg-surface-primary">
          <DialogTitle>Onchain deployments</DialogTitle>
          <DialogDescription className="sr-only">
            A larger view of which deployments of this token back which others.
          </DialogDescription>
          {diagram('h-[min(75vh,900px)]')}
        </DialogContent>
      </Dialog>
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
