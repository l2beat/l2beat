import clsx from 'clsx'

import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import { FIELD_HEIGHT, HEADER_HEIGHT } from '../store/utils/constants'
import { getColor } from './colors/colors'

export interface NodeViewProps {
  node: Node
  selected: boolean
}

export function NodeView(props: NodeViewProps) {
  const { color, isDark } = getColor(props.node.id, props.node.color)
  return (
    <div
      style={{
        left: props.node.box.x,
        top: props.node.box.y,
        width: props.node.box.width,
        height: props.node.box.height,
      }}
      className={clsx(
        'absolute rounded bg-black',
        props.selected && 'outline outline-3 outline-sun',
      )}
    >
      <div
        className={clsx(
          'mb-1 flex w-full justify-between rounded-t px-2 font-semibold text-sm',
          isDark ? 'text-milk' : 'text-black',
        )}
        style={{
          height: HEADER_HEIGHT - 4,
          lineHeight: HEADER_HEIGHT - 4 + 'px',
          backgroundColor: color,
        }}
      >
        <div className="truncate">{props.node.name || 'Unknown'}</div>
      </div>
      {props.node.fields.map((field, i) => (
        <NodeField key={i} field={field} selected={props.selected} />
      ))}
    </div>
  )
}

function NodeField(props: {
  field: Field
  selected: boolean
}) {
  const isHighlighted = useStore((state) =>
    state.selected.includes(props.field.target),
  )
  const targetHidden = useStore((state) =>
    state.hidden.includes(props.field.target),
  )

  const isLeft = props.field.connection.from.direction === 'left'

  return (
    <div className="relative">
      <div
        className={clsx(
          'w-full truncate rounded-full px-2 text-sm',
          isHighlighted && 'bg-sun text-black',
        )}
        style={{
          height: FIELD_HEIGHT,
          lineHeight: FIELD_HEIGHT + 'px',
        }}
      >
        {props.field.name}
      </div>
      {!targetHidden && (
        <div
          className={clsx(
            'absolute h-[10px] w-[10px] rounded-full',
            isHighlighted || props.selected ? 'bg-sun' : 'bg-cream',
          )}
          style={{
            left: isLeft ? -5 : undefined,
            right: isLeft ? undefined : -5,
            top: FIELD_HEIGHT / 2 - 5,
          }}
        />
      )}
    </div>
  )
}
