import clsx from 'clsx'

import { AddressIcon } from '../../common/AddressIcon'
import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import { FIELD_HEIGHT, HEADER_HEIGHT } from '../store/utils/constants'
import { getColor } from './colors/colors'

export interface NodeViewProps {
  node: Node
  selected: boolean
}

export function NodeView(props: NodeViewProps) {
  const { color, isDark } = getColor(props.node)

  const fullHeight =
    props.node.addressType === 'EOA' && props.node.fields.length === 0

  return (
    <div
      style={{
        left: props.node.box.x,
        top: props.node.box.y,
        width: props.node.box.width,
        height: props.node.box.height,
      }}
      className={clsx(
        'absolute bg-black',
        fullHeight ? 'rounded-2xl' : 'rounded',
        props.selected && 'outline outline-4 outline-autumn-300',
      )}
    >
      <div
        className={clsx(
          'mb-1 flex w-full items-center gap-1 px-2 font-medium text-sm',
          fullHeight ? 'rounded-2xl' : 'rounded-t',
          isDark ? 'text-coffee-200' : 'text-black',
        )}
        style={{
          height: fullHeight ? HEADER_HEIGHT : HEADER_HEIGHT - 4,
          background: color,
        }}
      >
        <AddressIcon type={props.node.addressType} />
        <div className="truncate">{props.node.name}</div>
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
          'w-full truncate rounded-full px-2 font-mono text-xs',
          isHighlighted && 'bg-autumn-300 text-black',
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
            isHighlighted || props.selected ? 'bg-autumn-300' : 'bg-coffee-400',
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
