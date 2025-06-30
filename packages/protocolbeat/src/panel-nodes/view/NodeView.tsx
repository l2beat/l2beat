import clsx from 'clsx'

import { AddressIcon } from '../../common/AddressIcon'
import { IconInitial } from '../../icons/IconInitial'
import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import {
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
} from '../store/utils/constants'
import { getColor } from './colors/colors'

export interface NodeViewProps {
  node: Node
  selected: boolean
  isDimmed?: boolean
}

export function NodeView(props: NodeViewProps) {
  const { isDark } = getColor(props.node)

  const fullHeight =
    props.node.addressType === 'EOA' && props.node.fields.length === 0

  return (
    <div
      style={{
        left: props.node.box.x,
        top: props.node.box.y,
        width: props.node.box.width,
        height: props.node.box.height,
        opacity: props.isDimmed ? 0.3 : 1,
      }}
      className={clsx(
        'absolute bg-black',
        fullHeight ? 'rounded-2xl' : 'rounded',
        props.selected && 'outline outline-4 outline-autumn-300',
      )}
    >
      <div
        className={clsx(
          'mb-1 flex w-full items-center justify-between gap-1 px-2 font-medium text-sm',
          fullHeight ? 'rounded-2xl' : 'rounded-t',
          isDark ? 'text-coffee-200' : 'text-black',
        )}
        style={{
          height: fullHeight ? HEADER_HEIGHT : HEADER_HEIGHT - 4,
          background: getTitleBackground(props.node),
        }}
      >
        <AddressIcon type={props.node.addressType} />
        <div className="truncate">{props.node.name}</div>
        <div className="flex items-center">
          {props.node.isInitial && <IconInitial className="text-aux-green" />}
          {props.node.hasTemplate && (
            <IconInitial className="text-aux-orange" />
          )}
        </div>
      </div>
      {props.node.fields
        .filter((field) => !props.node.hiddenFields.includes(field.name))
        .map((field, i) => (
          <NodeField
            key={i}
            field={field}
            selected={props.selected}
            isDimmed={props.isDimmed}
          />
        ))}
      {props.node.hiddenFields.length > 0 && (
        <div
          className="flex items-end justify-center text-center text-coffee-200/40 text-xs italic"
          style={{ height: HIDDEN_FIELDS_FOOTER_HEIGHT }}
        >
          +{props.node.hiddenFields.length} hidden field
          {props.node.hiddenFields.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

function getTitleBackground(node: Node): string {
  const { color, isDark } = getColor(node)
  if (!node.isInitial) {
    return color
  }

  const baseColor = color

  const contrastColorCSS = isDark
    ? `color-mix(in oklch, ${baseColor}, black 15%)` // Mix dark color with white
    : `color-mix(in oklch, ${baseColor}, white 15%)` // Mix light color with black

  return `repeating-radial-gradient(
    circle,
    ${contrastColorCSS} 0px,
    ${baseColor} 15px
  )`
}

function NodeField(props: {
  field: Field
  selected: boolean
  isDimmed?: boolean
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
