import clsx from 'clsx'
import { useCallback, useRef } from 'react'

import type { Connection, Node } from '../store/State'
import { useStore } from '../store/store'
import { NODE_WIDTH } from '../store/utils/constants'
import { OklchColor, oklchColorToCSS } from '../utils/color'
import { ResizeHandle } from './ResizeHandle'

export interface NodeViewProps {
  node: Node
  selected: boolean
  discovered: boolean
}

export function NodeView(props: NodeViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  const updateNodeLocations = useStore((state) => state.updateNodeLocations)
  // Using ref instead of inline event listener
  // to prevent side-menu from flashing on hidden node

  const onDoubleClick = useCallback(() => {
    if (!ref.current) {
      return
    }

    const newBox = getLocationByChildWidth(ref.current)

    updateNodeLocations({
      [props.node.simpleNode.id]: newBox,
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
        backgroundColor: oklchColorToCSS(props.node.simpleNode.color),
      }}
      className={clsx(
        'absolute rounded-md border-2 border-black',
        props.selected && 'outline outline-2 outline-blue-400',
        props.discovered ? '' : 'bg-yellow-300',
      )}
    >
      <div
        className={clsx(
          'flex h-[28px] w-full justify-between px-2 leading-[28px]',
          props.node.fields.length > 0 && 'border-black border-b-2',
        )}
      >
        <div className="truncate">{props.node.simpleNode.name}</div>
      </div>
      {props.node.fields.map(({ name, connection }, i) => (
        <NodeField
          key={i}
          name={name}
          connection={connection}
          color={props.node.simpleNode.color}
        />
      ))}
      <ResizeHandle
        nodeId={props.node.simpleNode.id}
        onDoubleClick={onDoubleClick}
      />
    </div>
  )
}

function NodeField(props: {
  name: string
  connection?: Connection
  color: OklchColor
}) {
  const isHighlighted = useStore(
    (state) =>
      props.connection && state.selected.includes(props.connection.nodeId),
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
        {props.name}
      </div>
      {props.connection && (
        <div
          className={clsx(
            'absolute h-[12px] w-[12px]',
            'rounded-full border-2 border-black bg-white',
          )}
          style={{
            left: props.connection.from.direction === 'left' ? -7 : undefined,
            right: props.connection.from.direction === 'right' ? -7 : undefined,
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
