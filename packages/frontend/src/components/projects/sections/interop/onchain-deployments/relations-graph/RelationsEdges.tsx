import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { InteropTokenRelationsEdge } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { EdgePath } from './routeRelationsEdges'

const ARROW_MARKER_ID = 'relations-arrow'
const ARROW_MARKER_ACTIVE_ID = 'relations-arrow-active'
const MAX_BADGE_ICONS = 3

export function RelationsEdgeMarkers() {
  return (
    <defs>
      <Marker id={ARROW_MARKER_ID} size={11} className="fill-primary/55" />
      <Marker id={ARROW_MARKER_ACTIVE_ID} size={13} className="fill-brand" />
    </defs>
  )
}

function Marker({
  id,
  size,
  className,
}: {
  id: string
  size: number
  className: string
}) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth={size}
      markerHeight={size}
      // Fixed size regardless of stroke width so direction stays legible.
      markerUnits="userSpaceOnUse"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" className={className} />
    </marker>
  )
}

export function RelationsEdgePath({
  path,
  isHighlighted,
  isDimmed,
}: {
  path: EdgePath
  isHighlighted: boolean
  isDimmed: boolean
}) {
  return (
    <path
      d={path.path}
      fill="none"
      className={cn(
        isHighlighted ? 'stroke-brand' : 'stroke-primary/30',
        isDimmed && 'opacity-10',
      )}
      strokeWidth={isHighlighted ? 2.5 : 1.75}
      markerEnd={`url(#${isHighlighted ? ARROW_MARKER_ACTIVE_ID : ARROW_MARKER_ID})`}
    />
  )
}

export function RelationsEdgeBadge({
  edge,
  at,
  isDimmed,
}: {
  edge: InteropTokenRelationsEdge
  at: EdgePath
  isDimmed: boolean
}) {
  if (edge.bridges.length === 0) return null
  const shown = edge.bridges.slice(0, MAX_BADGE_ICONS)
  const extra = edge.bridges.length - shown.length
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          style={{ left: at.midX, top: at.midY }}
          className={cn(
            '-translate-x-1/2 -translate-y-1/2 absolute flex h-5 w-max min-w-5 items-center gap-0.5 rounded-full border border-divider bg-surface-primary px-0.5',
            isDimmed && 'opacity-10',
          )}
        >
          <span className="-space-x-1 flex shrink-0">
            {shown.map((bridge) => (
              <img
                key={bridge.id}
                src={bridge.iconUrl}
                alt=""
                className="size-3.5 shrink-0 rounded-full"
              />
            ))}
          </span>
          {extra > 0 && (
            <span className="font-bold text-2xs text-secondary">+{extra}</span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        Minted by {edge.bridges.map((bridge) => bridge.name).join(', ')}
      </TooltipContent>
    </Tooltip>
  )
}
