import clsx from 'clsx'
import { memo } from 'react'

import { AddressIcon } from '../../../../components/AddressIcon'
import { IconInitial } from '../../../../icons/IconInitial'
import type { Node } from '../store/State'
import {
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
} from '../store/utils/constants'
import { getRowLayout } from '../store/utils/rows'
import { getColor } from './colors/colors'

// Which sides of a row carry a link to a visible target: 'n'one, 'l'eft,
// 'r'ight or 'b'oth. A compressed row can reach targets on either side.
export type RowDots = 'n' | 'l' | 'r' | 'b'

export interface NodeViewProps {
  node: Node
  isSelected: boolean
  isDimmed: boolean
  isGrayedOut: boolean
  isOverlapping: boolean
  // Per-row flags packed into a string ("01101..." / "nlrb..."). Stable enough
  // for `===` comparison in the memo comparator; cheaper than allocating an
  // array per render.
  rowHighlightedMask: string
  rowDotMask: string
}

function NodeViewImpl(props: NodeViewProps) {
  const { color, isDark } = getColor(props.node)
  const { rows } = getRowLayout(props.node)

  const fullHeight =
    props.node.addressType === 'EOA' && props.node.fields.length === 0
  const isGroup = props.node.subnodes.length > 0

  return (
    <>
      <div
        style={{
          left: props.node.box.x,
          top: props.node.box.y,
          width: props.node.box.width,
          height: props.node.box.height,
          opacity: props.isGrayedOut ? 0.2 : props.isDimmed ? 0.3 : 1,
          filter: props.isGrayedOut ? 'grayscale(100%)' : 'none',
          zIndex: props.isDimmed ? 0 : 10,
        }}
        className={clsx(
          'absolute bg-black',
          fullHeight ? 'rounded-2xl' : isGroup ? 'rounded-xl' : 'rounded',
          props.isSelected
            ? 'outline outline-4 outline-autumn-300'
            : isGroup && 'outline outline-dashed outline-2 outline-coffee-200',
        )}
      >
        <div
          className={clsx(
            'mb-1 flex w-full items-center justify-between gap-1 px-2 font-medium text-sm',
            fullHeight ? 'rounded-2xl' : isGroup ? 'rounded-t-xl' : 'rounded-t',
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
        {rows.map((row, i) => (
          <NodeRow
            key={row.key}
            label={row.label}
            isSelected={props.isSelected}
            isHighlighted={props.rowHighlightedMask[i] === '1'}
            dots={(props.rowDotMask[i] ?? 'n') as RowDots}
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
      {props.isOverlapping && !props.isDimmed && !props.isGrayedOut && (
        <div
          className={clsx(
            'pointer-events-none absolute border-2 border-dashed',
            fullHeight ? 'rounded-2xl' : 'rounded',
          )}
          style={{
            left: props.node.box.x,
            top: props.node.box.y,
            width: props.node.box.width,
            height: props.node.box.height,
            zIndex: 20,
            borderColor: color,
          }}
        />
      )}
    </>
  )
}

export const NodeView = memo(NodeViewImpl, (prev, next) => {
  return (
    prev.node === next.node &&
    prev.isSelected === next.isSelected &&
    prev.isDimmed === next.isDimmed &&
    prev.isGrayedOut === next.isGrayedOut &&
    prev.isOverlapping === next.isOverlapping &&
    prev.rowHighlightedMask === next.rowHighlightedMask &&
    prev.rowDotMask === next.rowDotMask
  )
})

function getTitleBackground(node: Node): string {
  const { color, isDark } = getColor(node)
  if (!node.isInitial) {
    return color
  }

  const baseColor = color

  const contrastColorCSS = isDark
    ? `color-mix(in oklch, ${baseColor}, black 15%)`
    : `color-mix(in oklch, ${baseColor}, white 15%)`

  return `repeating-radial-gradient(
    circle,
    ${contrastColorCSS} 0px,
    ${baseColor} 15px
  )`
}

interface NodeRowProps {
  label: string
  isSelected: boolean
  isHighlighted: boolean
  dots: RowDots
}

function NodeRowImpl(props: NodeRowProps) {
  return (
    <div className="relative">
      <div
        className={clsx(
          'w-full truncate rounded-full px-2 font-mono text-xs',
          props.isHighlighted && 'bg-autumn-300 text-black',
        )}
        style={{
          height: FIELD_HEIGHT,
          lineHeight: FIELD_HEIGHT + 'px',
        }}
      >
        {props.label}
      </div>
      {DOT_SIDES.filter(
        (side) => props.dots === side || props.dots === 'b',
      ).map((side) => (
        <div
          key={side}
          className={clsx(
            'absolute h-[10px] w-[10px] rounded-full',
            props.isHighlighted || props.isSelected
              ? 'bg-autumn-300'
              : 'bg-coffee-400',
          )}
          style={{
            left: side === 'l' ? -5 : undefined,
            right: side === 'l' ? undefined : -5,
            top: FIELD_HEIGHT / 2 - 5,
          }}
        />
      ))}
    </div>
  )
}

const DOT_SIDES = ['l', 'r'] as const

const NodeRow = memo(NodeRowImpl)
