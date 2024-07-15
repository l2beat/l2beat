import clsx from 'clsx'
import { useCallback, useEffect, useRef } from 'react'

import type { Node } from '../store/State'
import { useStore } from '../store/store'
import { NODE_WIDTH, RESIZE_HANDLE_SPACING } from '../store/utils/constants'
import { ResizeHandle } from './ResizeHandle'

export interface NodeViewProps {
  node: Node
  selected: boolean
  discovered: boolean
  onHideNode: (nodeId: string) => void
  loading: boolean
}

export function NodeView(props: NodeViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  const updateNodeLocations = useStore((state) => state.updateNodeLocations)
  // Using ref instead of inline event listener
  // to prevent side-menu from flashing on hidden node
  const hideRef = useRef<HTMLButtonElement>(null)
  const onHide = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      props.onHideNode(props.node.simpleNode.id)
    },
    [props.onHideNode, props.node.simpleNode.id],
  )

  useEffect(() => {
    if (hideRef.current) {
      // The `true` argument here signifies that this listener is for the capture phase
      // actively prevent store-attached events from firing
      hideRef.current.addEventListener('mousedown', onHide, true)
    }

    return () => {
      hideRef.current?.removeEventListener('mousedown', onHide, true)
    }
  }, [])

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
        height: props.node.box.height + RESIZE_HANDLE_SPACING,
      }}
      className={clsx(
        'absolute rounded-md border-2 border-black bg-white',
        props.selected && 'outline outline-2 outline-blue-400',
        props.discovered ? 'bg-white' : 'bg-yellow-300',
      )}
    >
      <div
        className={clsx(
          'flex h-[28px] w-full justify-between px-2 leading-[28px]',
          props.node.fields.length > 0 && 'border-black border-b-2',
        )}
      >
        <div className="truncate">{props.node.simpleNode.name}</div>
        <div className="flex items-center justify-center gap-2">
          <button ref={hideRef} disabled={props.loading}>
            👁️
          </button>
        </div>
      </div>
      {props.node.fields.map(({ name, connection }, i) => (
        <div className="relative" key={i}>
          <div className="h-[24px] w-full truncate px-2 leading-[24px]">
            {name}
          </div>
          {connection && (
            <div
              className={clsx(
                'absolute h-[12px] w-[12px]',
                'rounded-full border-2 border-black bg-white',
              )}
              style={{
                left: connection.from.direction === 'left' ? -7 : undefined,
                right: connection.from.direction === 'right' ? -7 : undefined,
                top: 6,
              }}
            />
          )}
        </div>
      ))}
      <ResizeHandle
        nodeId={props.node.simpleNode.id}
        onDoubleClick={onDoubleClick}
      />
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
