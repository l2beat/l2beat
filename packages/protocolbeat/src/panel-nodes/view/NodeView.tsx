import clsx from 'clsx'
import { useCallback, useRef } from 'react'

import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import { OklchColor, oklchColorToCSS } from '../store/utils/color'
import { NODE_WIDTH } from '../store/utils/constants'
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
        backgroundColor: oklchColorToCSS(props.node.color),
      }}
      className={clsx(
        'absolute rounded-md border-2 border-black',
        props.selected && 'outline outline-2 outline-blue-400',
      )}
    >
      <div
        className={clsx(
          'flex h-[28px] w-full justify-between px-2 leading-[28px]',
          props.node.fields.length > 0 && 'border-black border-b-2',
        )}
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

function NodeField(props: { field: Field; color: OklchColor }) {
  const isHighlighted = useStore((state) =>
    state.selected.includes(props.field.target),
  )
  const targetHidden = useStore((state) =>
    state.hidden.includes(props.field.target),
  )

  const highlightedColor: OklchColor = {
    l: 0.65,
    c: Math.max(props.color.c, 0.1),
    h: (props.color.h + 180) % 360,
  }
  return (
    <div className="relative">
      <div
        className="h-[24px] w-full truncate rounded-full px-2 leading-[24px]"
        style={{
          backgroundColor: isHighlighted
            ? oklchColorToCSS(highlightedColor)
            : undefined,
        }}
      >
        {props.field.name}
      </div>
      {!targetHidden && (
        <div
          className={clsx(
            'absolute h-[12px] w-[12px]',
            'rounded-full border-2 border-black bg-white',
          )}
          style={{
            left:
              props.field.connection.from.direction === 'left' ? -7 : undefined,
            right:
              props.field.connection.from.direction === 'right'
                ? -7
                : undefined,
            top: 6,
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
