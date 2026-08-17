import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/components/core/Dialog'
import type { InteropTokenRelationsGraph } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { RelationsDiagram } from './RelationsDiagram'

/**
 * The relations diagram, without a section shell of its own — it sits above
 * the deployments table, which is the list of the very same things.
 */
export function TokenRelationsGraphView({
  graph,
}: {
  graph: InteropTokenRelationsGraph
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    undefined,
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const unconnectedCount = graph.unconnectedNodeIds.length

  return (
    <div>
      <RelationsDiagram
        graph={graph}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        onExpand={() => setIsExpanded(true)}
      />

      <Legend />

      {unconnectedCount > 0 && (
        <p className="mt-2 text-label-value-13 text-secondary">
          {unconnectedCount === 1
            ? '1 deployment has no observed connection to the others.'
            : `${unconnectedCount} deployments have no observed connection to the others.`}
        </p>
      )}

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[min(1400px,95vw)] bg-surface-primary">
          <DialogTitle>Onchain deployments</DialogTitle>
          <DialogDescription className="sr-only">
            A larger view of the diagram showing which deployments of this token
            back which others.
          </DialogDescription>
          <RelationsDiagram
            graph={graph}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            // Fills the dialog minus its title, legend and padding, so the
            // larger view is actually larger than the inline one.
            heightOverride={
              typeof window === 'undefined'
                ? 640
                : Math.min(900, Math.max(420, window.innerHeight - 220))
            }
          />
          <Legend />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-label-value-13 text-secondary">
      <span className="flex items-center gap-2">
        <svg width="26" height="8" aria-hidden className="shrink-0">
          <title>Backing arrow</title>
          <line
            x1="0"
            y1="4"
            x2="18"
            y2="4"
            className="stroke-primary"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          <path
            d="M 18 0 L 26 4 L 18 8 z"
            className="fill-primary"
            fillOpacity="0.55"
          />
        </svg>
        Backs
      </span>
      <span className="flex items-center gap-2">
        <span className="-space-x-1.5 flex shrink-0">
          <span className="size-4 rounded-full border border-divider bg-surface-primary" />
          <span className="size-4 rounded-full border border-divider bg-surface-primary" />
        </span>
        Burn-mint relation
      </span>
      <span className="flex items-center gap-2">
        <span className="size-4 shrink-0 rounded border border-divider border-dashed" />
        No observed connections
      </span>
    </div>
  )
}
