import clsx from 'clsx'
import { useCallback, useRef } from 'react'

import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import { OklchColor, oklchColorToCSS } from '../store/utils/color'
import {
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  NODE_WIDTH,
} from '../store/utils/constants'
import { ResizeHandle } from './ResizeHandle'

export interface NodeViewProps {
  node: Node
  selected: boolean
}

export function NodeView(props: NodeViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  const updateNodeLocations = useStore((state) => state.layout)
  // Using ref instead of inline event listener
  // to prevent side-menu from flashing on hidden node

  const onDoubleClick = useCallback(() => {
    if (!ref.current) {
      return
    }

    const newBox = getLocationByChildWidth(ref.current)

    updateNodeLocations({
      [props.node.id]: newBox,
    })
  }, [])

  return (
    <div
      ref={ref}
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
        <NodeField key={i} field={field} color={props.node.color} />
      ))}
      <ResizeHandle nodeId={props.node.id} onDoubleClick={onDoubleClick} />
    </div>
  )
}

function NodeField(props: {
  field: Field
  color: OklchColor
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
            isHighlighted ? 'bg-sun' : 'bg-cream',
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

/**
 * Render children with out parent constraints to compute actual width we should expand into
 */
function getAbsoluteWidth(element: Element) {
  // deep clone to have potential descendants
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = 'auto'
  clone.style.position = 'absolute'
  clone.style.visibility = 'hidden'
  clone.style.pointerEvents = 'none'
  clone.style.transform = 'translateZ(0)'

  document.body.appendChild(clone)

  const { offsetWidth: width } = clone

  document.body.removeChild(clone)

  return width
}

function getLocationByChildWidth(element: HTMLElement) {
  const AUTO_EXPAND_ADDITIONAL_SPACE = 20

  const absoluteWidths = Array.from(element.children).map((children) =>
    getAbsoluteWidth(children),
  )

  const newWidth = Math.max(...absoluteWidths, NODE_WIDTH)

  const newWidthWithOffset = newWidth + AUTO_EXPAND_ADDITIONAL_SPACE

  const newBox = {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: newWidthWithOffset,
  }

  return newBox
}
