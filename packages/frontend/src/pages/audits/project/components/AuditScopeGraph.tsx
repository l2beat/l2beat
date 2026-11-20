import { useCallback, useMemo, useState } from 'react'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
} from '~/components/core/Popover'
import { fitContainCamera, type Size } from '~/components/pan-zoom/camera'
import { CameraWorld, PanZoomFrame } from '~/components/pan-zoom/PanZoomFrame'
import { usePanZoom } from '~/components/pan-zoom/usePanZoom'
import { ZoomControls } from '~/components/pan-zoom/ZoomControls'
import type {
  AuditsScopeNode,
  AuditsScopeSnapshot,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import {
  edgePath,
  LANE_TITLE_HEIGHT,
  type LaneId,
  layoutScopeGraph,
  NODE_WIDTH,
  packageLabel,
} from './scopeGraphLayout'

const INITIAL_VIEWPORT = { width: 900, height: 560 }
const FRAME_HEIGHT_MIN = 220
const FRAME_HEIGHT_MAX = 560
const FIT_PADDING = 16
/** Above this many arrows they are drawn fainter, so the units stay readable. */
const DENSE_EDGES = 250

type Look =
  | 'audited'
  | 'partial'
  | 'excluded'
  | 'silent'
  | 'external'
  | 'unknown'

const LOOK: Record<Look, { label: string; description: string; node: string }> =
  {
    audited: {
      label: 'Named as audited',
      description:
        'The report lists this code as audited, at the audited commit.',
      node: 'border-scope-named bg-scope-named text-scope-named-on',
    },
    partial: {
      label: 'Named, reviewed in part',
      description:
        'The report names this code but reviewed only a diff or selected functions of it.',
      node: 'border-scope-named bg-scope-named-stripes text-scope-named-ink',
    },
    excluded: {
      label: 'Named as out of scope',
      description:
        'The report says this code was not reviewed: it lists it as out of scope, or covers it with a general statement.',
      node: 'border-scope-named bg-surface-primary text-scope-named-ink',
    },
    silent: {
      label: 'Not mentioned',
      description:
        "The project's own code that the audited code depends on. The report says nothing about it, so whether it was reviewed is a guess.",
      node: 'border-not-counted bg-not-counted/20 text-not-counted-ink',
    },
    external: {
      label: 'External, not mentioned',
      description:
        'Code from outside the audited repository, such as a library, at the version the audited commit pins. The report says nothing about it.',
      node: 'border-scope-external bg-scope-external/15 text-scope-external-ink',
    },
    unknown: {
      label: 'Source not found',
      description:
        'A dependency of the audited code whose source could not be read at the audited commit. The report does not mention it.',
      node: 'border-secondary/50 border-dashed bg-surface-primary text-secondary',
    },
  }

const LANE: Record<LaneId, { title: string; band: string }> = {
  named: { title: 'Named in the report', band: 'bg-scope-named/6' },
  silent: { title: 'Own code, not mentioned', band: 'bg-not-counted/6' },
  external: { title: 'External dependencies', band: 'bg-scope-external/6' },
}

function frameHeight(content: Size, frameWidth: number): number {
  const scale = Math.min(1, (frameWidth - FIT_PADDING * 2) / content.width)
  return Math.max(
    FRAME_HEIGHT_MIN,
    Math.min(FRAME_HEIGHT_MAX, content.height * scale + FIT_PADDING * 2),
  )
}

function lookOf(node: AuditsScopeNode): Look {
  switch (node.state) {
    case 'included':
      return node.partial ? 'partial' : 'audited'
    case 'excluded':
      return 'excluded'
    case 'unavailable':
      return 'unknown'
    case 'not-mentioned':
      return node.external ? 'external' : 'silent'
  }
}

/**
 * What one report names at one commit and what that code depends on, in three
 * lanes: named in the report, own code the report is silent about, external
 * dependencies. Hovering or selecting a unit lights the units that lead to it
 * from the audited code and the units it depends on directly.
 */
export function AuditScopeGraph({
  snapshot,
}: {
  snapshot: AuditsScopeSnapshot
}) {
  const layout = useMemo(() => layoutScopeGraph(snapshot), [snapshot])
  const paths = useMemo(
    () =>
      snapshot.edges.map(([from, to]) => {
        const [a, b] = [layout.boxes[from], layout.boxes[to]]
        return a && b ? edgePath(a, b) : undefined
      }),
    [snapshot, layout],
  )
  const fitTo = useCallback(
    (viewport: Size) => fitContainCamera(layout, viewport, FIT_PADDING),
    [layout],
  )
  const panZoom = usePanZoom({
    content: layout,
    fitTo,
    fillsView: false,
    initialViewport: INITIAL_VIEWPORT,
  })

  const [hovered, setHovered] = useState<number>()
  const [selected, setSelected] = useState<number>()
  const activeId = hovered ?? selected
  const active = useMemo(
    () => (activeId === undefined ? undefined : chainOf(snapshot, activeId)),
    [snapshot, activeId],
  )
  const looks = useMemo(
    () => new Set(snapshot.nodes.map(lookOf)),
    [snapshot.nodes],
  )
  const kinds = useMemo(
    () => new Set(snapshot.edges.map(([, , kind]) => kind)),
    [snapshot.edges],
  )
  const selectedNode =
    selected === undefined ? undefined : snapshot.nodes[selected]
  const isDense = snapshot.edges.length > DENSE_EDGES

  return (
    <Popover
      open={selectedNode !== undefined}
      onOpenChange={(open) => {
        if (!open) setSelected(undefined)
      }}
    >
      <div className="flex flex-col gap-2">
        {/* As tall as the graph is once it fits the width, so a small one leaves no empty frame. */}
        <div
          style={{ height: frameHeight(layout, panZoom.viewport.width) }}
          className="max-h-[70vh]"
        >
          <PanZoomFrame
            panZoom={panZoom}
            className="h-full"
            onClick={() => {
              if (!panZoom.consumeSuppressedClick()) setSelected(undefined)
            }}
          >
            <CameraWorld panZoom={panZoom}>
              {layout.lanes.map((lane) => (
                <div
                  key={lane.id}
                  style={{
                    left: lane.box.x,
                    top: lane.box.y,
                    width: lane.box.width,
                    height: lane.box.height,
                  }}
                  className={cn('absolute rounded-xl', LANE[lane.id].band)}
                >
                  <div
                    style={{ height: LANE_TITLE_HEIGHT }}
                    className="flex items-center gap-1.5 whitespace-nowrap px-3.5 font-medium text-primary text-xs"
                  >
                    {LANE[lane.id].title}
                    <span className="font-normal text-secondary">
                      {lane.count}
                    </span>
                  </div>
                </div>
              ))}
              {layout.packages.map((label) => (
                <div
                  key={`${label.text}@${label.x},${label.y}`}
                  style={{ left: label.x, top: label.y, width: NODE_WIDTH }}
                  className="absolute flex h-7 items-end pb-0.5 font-medium text-[11px] text-scope-external-ink"
                >
                  <span className="truncate">{label.text}</span>
                </div>
              ))}
              <svg
                width={layout.width}
                height={layout.height}
                className="pointer-events-none absolute top-0 left-0 overflow-visible"
                aria-hidden
              >
                <EdgeMarkers />
                {snapshot.edges.map(([from, to, kind], index) => {
                  const path = paths[index]
                  if (!path) return null
                  const isLit = active?.edges.has(index) ?? false
                  return (
                    <path
                      key={`${from}-${to}`}
                      d={path}
                      fill="none"
                      strokeWidth={isLit ? 2 : 1.25}
                      strokeDasharray={kind === 'uses' ? '4 3' : undefined}
                      markerEnd={`url(#scope-${kind}${isLit ? '-lit' : ''})`}
                      className={cn(
                        isLit
                          ? 'stroke-brand'
                          : isDense
                            ? 'stroke-primary/15'
                            : 'stroke-primary/35',
                        active !== undefined && !isLit && 'opacity-15',
                      )}
                    />
                  )
                })}
              </svg>
              {snapshot.nodes.map((node, index) => {
                const box = layout.boxes[index]
                if (!box) return null
                const key = `${node.path}#${node.name}`
                const button = (
                  <button
                    key={key}
                    type="button"
                    style={{
                      left: box.x,
                      top: box.y,
                      width: box.width,
                      height: box.height,
                    }}
                    className={cn(
                      'absolute flex items-center rounded-md border px-2 text-left',
                      'focus-visible:outline-2 focus-visible:outline-brand/50',
                      LOOK[lookOf(node)].node,
                      selected === index && 'ring-2 ring-brand ring-offset-1',
                      active !== undefined &&
                        !active.nodes.has(index) &&
                        'opacity-25',
                    )}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (panZoom.consumeSuppressedClick()) return
                      setSelected(selected === index ? undefined : index)
                    }}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(undefined)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(undefined)}
                  >
                    <span className="truncate font-semibold text-xs">
                      {node.name}
                    </span>
                  </button>
                )
                return selected === index ? (
                  <PopoverAnchor key={key} asChild>
                    {button}
                  </PopoverAnchor>
                ) : (
                  button
                )
              })}
            </CameraWorld>
            <ZoomControls camera={panZoom.camera} />
          </PanZoomFrame>
        </div>
        <Legend looks={looks} kinds={kinds} />
      </div>
      {selectedNode && selected !== undefined && (
        <PopoverPortal>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            updatePositionStrategy="always"
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="w-[300px] p-3"
          >
            <NodeCard
              node={selectedNode}
              relations={relationsOf(snapshot, selected)}
            />
          </PopoverContent>
        </PopoverPortal>
      )}
    </Popover>
  )
}

/** UML arrowheads: a hollow triangle for a base contract, an open one for a use. */
function EdgeMarkers() {
  return (
    <defs>
      {(['', '-lit'] as const).map((suffix) => {
        const stroke = suffix === '' ? 'stroke-primary/50' : 'stroke-brand'
        return [
          <marker
            key={`inherits${suffix}`}
            id={`scope-inherits${suffix}`}
            viewBox="0 0 12 12"
            refX="11"
            refY="6"
            markerWidth="11"
            markerHeight="11"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path
              d="M 1 1 L 11 6 L 1 11 z"
              className={cn('fill-surface-primary', stroke)}
              strokeWidth="1.25"
            />
          </marker>,
          <marker
            key={`uses${suffix}`}
            id={`scope-uses${suffix}`}
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="9"
            markerHeight="9"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path
              d="M 2 1.5 L 10 6 L 2 10.5"
              fill="none"
              className={stroke}
              strokeWidth="1.5"
            />
          </marker>,
        ]
      })}
    </defs>
  )
}

function NodeCard({
  node,
  relations,
}: {
  node: AuditsScopeNode
  relations: { dependsOn: number; dependents: number; bases: number }
}) {
  const look = LOOK[lookOf(node)]
  return (
    <div className="flex flex-col gap-2 text-xs">
      <div>
        <div className="break-words font-bold text-sm">{node.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'rounded border px-1.5 py-px font-medium text-[11px]',
              look.node,
            )}
          >
            {look.label}
          </span>
          <span className="text-secondary">
            {node.kind === 'abstract' ? 'abstract contract' : node.kind}
          </span>
        </div>
      </div>
      <p className="text-secondary">
        {look.description}
        {node.generic &&
          ' Here that comes from a general statement about dependencies.'}
      </p>
      <p>
        {relations.dependents > 0
          ? `Used by ${count(relations.dependents, 'unit')} of this graph.`
          : 'Nothing in this graph depends on it.'}{' '}
        {relations.dependsOn > 0 &&
          `Depends on ${count(relations.dependsOn, 'unit')}${
            relations.bases > 0
              ? `, ${relations.bases} as ${relations.bases === 1 ? 'a base contract' : 'base contracts'}`
              : ''
          }.`}
      </p>
      <div className="break-all text-secondary">
        {node.external && (
          <div className="mb-0.5 font-medium text-scope-external-ink">
            {packageLabel(node)}
          </div>
        )}
        {node.url ? (
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline"
          >
            {node.path}
          </a>
        ) : (
          node.path
        )}
      </div>
    </div>
  )
}

function Legend({
  looks,
  kinds,
}: {
  looks: Set<Look>
  kinds: Set<'inherits' | 'uses'>
}) {
  const shown = (Object.keys(LOOK) as Look[]).filter((look) => looks.has(look))
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-secondary text-xs">
      {shown.map((look) => (
        <span key={look} className="flex items-center gap-1.5">
          <span
            className={cn(
              'h-3 w-5 shrink-0 rounded-sm border',
              LOOK[look].node,
            )}
          />
          {LOOK[look].label}
        </span>
      ))}
      {kinds.has('inherits') && (
        <span className="flex items-center gap-1.5">
          <LegendArrow kind="inherits" />
          inherits from
        </span>
      )}
      {kinds.has('uses') && (
        <span className="flex items-center gap-1.5">
          <LegendArrow kind="uses" />
          calls or uses
        </span>
      )}
    </div>
  )
}

function LegendArrow({ kind }: { kind: 'inherits' | 'uses' }) {
  return (
    <svg width="30" height="10" aria-hidden className="shrink-0">
      <line
        x1="0"
        x2={kind === 'inherits' ? 20 : 27}
        y1="5"
        y2="5"
        className="stroke-primary/60"
        strokeWidth="1.25"
        strokeDasharray={kind === 'uses' ? '4 3' : undefined}
      />
      {kind === 'inherits' ? (
        <path
          d="M 20 1 L 29 5 L 20 9 z"
          className="fill-surface-primary stroke-primary/60"
          strokeWidth="1.25"
        />
      ) : (
        <path
          d="M 22 1.5 L 29 5 L 22 8.5"
          fill="none"
          className="stroke-primary/60"
          strokeWidth="1.5"
        />
      )}
    </svg>
  )
}

/**
 * The units that lead to `id` from the audited code, with `id` and what it
 * depends on directly, and the arrows between them.
 */
function chainOf(
  snapshot: AuditsScopeSnapshot,
  id: number,
): { nodes: Set<number>; edges: Set<number> } {
  const nodes = new Set([id])
  const edges = new Set<number>()
  const queue = [id]
  for (const current of queue) {
    snapshot.edges.forEach(([from, to], index) => {
      if (to !== current) return
      edges.add(index)
      if (!nodes.has(from)) {
        nodes.add(from)
        queue.push(from)
      }
    })
  }
  snapshot.edges.forEach(([from, to], index) => {
    if (from !== id) return
    edges.add(index)
    nodes.add(to)
  })
  return { nodes, edges }
}

function relationsOf(snapshot: AuditsScopeSnapshot, id: number) {
  const out = snapshot.edges.filter(([from]) => from === id)
  return {
    dependsOn: out.length,
    bases: out.filter(([, , kind]) => kind === 'inherits').length,
    dependents: snapshot.edges.filter(([, to]) => to === id).length,
  }
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`
}
