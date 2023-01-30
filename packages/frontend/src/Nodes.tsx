import { useEffect, useMemo, useState } from 'react'

import { Node } from './Node'
import { Viewport } from './Viewport'

export type NodeProps = NodesProps['nodes'][number]
export type FieldProps = NodesProps['nodes'][number]['fields'][number]

export interface NodesProps {
  nodes: {
    id: string
    name: string
    onDiscover?: () => void
    fields: {
      name: string
      connection?: string // foreign key id
      value?: string
    }[]
    data?: unknown
  }[]
  selected: string | undefined
  onSelect: (id: string) => void
  loading: Record<string, boolean | undefined>
}

type PositionMap = Record<string, { x: number; y: number } | undefined>

const WIDTH = 200
const HEADER_HEIGHT = 28

export function Nodes({ nodes, selected, onSelect, loading }: NodesProps) {
  const [positions, setPositions] = useState<PositionMap>({})

  useEffect(() => {
    const newPositions: PositionMap = {}
    for (const [i, node] of nodes.entries()) {
      newPositions[node.id] = positions[node.id] ?? {
        x: 50 + (WIDTH + 30) * i,
        y: 50,
      }
    }
    setPositions(newPositions)
  }, [nodes])

  const translate = useMemo(
    () =>
      function translate(id: string, delta: { x: number; y: number }) {
        setPositions((positions) => ({
          ...positions,
          [id]: {
            x: (positions[id]?.x ?? 0) + delta.x,
            y: (positions[id]?.y ?? 0) + delta.y,
          },
        }))
      },
    [setPositions],
  )

  return (
    <Viewport>
      {nodes.map((node) => (
        <Node
          key={node.id}
          id={node.id}
          position={positions[node.id] ?? { x: 0, y: 0 }}
          onTranslate={translate}
          width={WIDTH}
          name={node.name}
          onDiscover={node.onDiscover}
          selected={selected === node.id}
          onSelect={() => onSelect(node.id)}
          loading={!!loading[node.id]}
          fields={node.fields.map((field) => ({
            name: field.name,
            value: field.value,
            connection: field.connection
              ? {
                  x: positions[field.connection]?.x ?? 0,
                  y: (positions[field.connection]?.y ?? 0) + HEADER_HEIGHT / 2,
                  width: WIDTH,
                }
              : undefined,
          }))}
        />
      ))}
    </Viewport>
  )
}
