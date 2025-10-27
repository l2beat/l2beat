import { useGlobalSettingsStore } from '../../store/global-settings-store'
import { useStore } from '../store/store'
import { Connection } from './Connection'
import { NodeView } from './NodeView'

export function NodesAndConnections() {
  const nodes = useStore((s) => s.nodes)
  const hidden = useStore((s) => s.hidden)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore(
    ({ userPreferences }) => userPreferences.enableDimming,
  )
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const visible = nodes.filter((n) => !hidden.includes(n.id))

  const connections = visible
    .flatMap((node) =>
      node.fields.map((field, i) => {
        const shouldHide =
          hidden.includes(field.target) ||
          node.hiddenFields.includes(field.name)

        if (shouldHide) return null

        const targetNode = visible.find((n) => n.id === field.target)
        const isDashed =
          targetNode?.addressType === 'EOA' ||
          targetNode?.addressType === 'EOAPermissioned'
        const isHighlighted =
          selected.includes(node.id) || selected.includes(field.target)
        const isDimmed = enableDimming && selected.length > 0 && !isHighlighted
        const isGrayedOut =
          markUnreachableEntries &&
          !(node.isReachable && targetNode?.isReachable)

        return {
          key: `${node.id}-${i}-${field.target}`,
          from: field.connection.from,
          to: field.connection.to,
          isHighlighted,
          isDashed,
          isDimmed,
          isGrayedOut,
        }
      }),
    )
    .filter(Boolean) as {
    key: string
    from: { x: number; y: number; direction: 'left' | 'right' }
    to: { x: number; y: number; direction: 'left' | 'right' }
    isHighlighted: boolean
    isDashed: boolean
    isDimmed: boolean
  }[]

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  connections.forEach(({ from, to }) => {
    minX = Math.min(minX, from.x, to.x) - 200
    maxX = Math.max(maxX, from.x, to.x) + 200
    minY = Math.min(minY, from.y, to.y) - 200
    maxY = Math.max(maxY, from.y, to.y) + 200
  })

  const width = maxX - minX
  const height = maxY - minY

  return (
    <>
      <svg
        viewBox={`${minX} ${minY} ${width} ${height}`}
        className="pointer-events-none absolute"
        style={{ left: minX, top: minY, width, height }}
        fill="none"
      >
        {connections.map((c) => (
          <Connection {...c} />
        ))}
      </svg>

      {visible.map((node) => {
        const highlightedIds =
          enableDimming && selected.length
            ? new Set([
                ...selected,
                ...visible
                  .filter((n) => selected.includes(n.id))
                  .flatMap((n) =>
                    n.fields
                      .filter((f) => !n.hiddenFields.includes(f.name))
                      .map((f) => f.target),
                  ),
                ...visible
                  .filter((n) =>
                    n.fields
                      .filter((f) => !n.hiddenFields.includes(f.name))
                      .some((f) => selected.includes(f.target)),
                  )
                  .map((n) => n.id),
              ])
            : new Set()

        const nodeHighlighted = highlightedIds.has(node.id)
        const isDimmed =
          enableDimming && selected.length > 0 && !nodeHighlighted
        const isGrayedOut = markUnreachableEntries && !node.isReachable

        return (
          <NodeView
            key={node.id}
            node={node}
            selected={selected.includes(node.id)}
            isDimmed={isDimmed}
            isGrayedOut={isGrayedOut}
          />
        )
      })}
    </>
  )
}
