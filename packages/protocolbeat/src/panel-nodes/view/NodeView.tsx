import clsx from 'clsx'

import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import { OklchColor, oklchColorToCSS } from '../store/utils/color'
import { FIELD_HEIGHT, HEADER_HEIGHT } from '../store/utils/constants'

export interface NodeViewProps {
  node: Node
  selected: boolean
}

export function NodeView(props: NodeViewProps) {
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
          'mb-1 flex w-full justify-between rounded-t px-2 font-bold text-sm',
          props.node.fields.length > 0 && 'border border-milk',
          props.node.color.l > 0.5 ? 'text-black' : 'text-milk',
        )}
        style={{
          height: HEADER_HEIGHT - 4,
          lineHeight: HEADER_HEIGHT - 4 - 2 + 'px',
          backgroundColor: oklchColorToCSS(props.node.color),
        }}
      >
        <div className="truncate">{props.node.name}</div>
      </div>
      {props.node.fields.map((field, i) => (
        <NodeField
          key={i}
          field={field}
          color={props.node.color}
          selected={props.selected}
        />
      ))}
    </div>
  )
}

function NodeField(props: {
  field: Field
  color: OklchColor
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
