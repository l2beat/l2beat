import classNames from 'classnames'
import { useCallback, useRef } from 'react'

import { Node } from '../store/State'
import { useStore } from '../store/store'
import { NODE_WIDTH, RESIZE_HANDLE_SPACING } from '../store/utils/constants'
import { ResizeHandle } from './ResizeHandle'

export interface NodeViewProps {
  node: Node
  selected: boolean
  discovered: boolean
  onDiscover: (nodeId: string) => void
  loading: boolean
}

export function NodeView(props: NodeViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  const updateNodeLocations = useStore((state) => state.updateNodeLocations)

  const onDiscover = useCallback(() => {
    props.onDiscover(props.node.simpleNode.id)
  }, [props.onDiscover, props.node.simpleNode.id])

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
      className={classNames(
        'absolute rounded-md border-2 border-black bg-white',
        props.selected && 'outline outline-2 outline-blue-400',
        props.discovered ? 'bg-white' : 'bg-yellow-300',
      )}
    >
      <div
        className={classNames(
          'flex h-[28px] w-full justify-between px-2 leading-[28px]',
          props.node.fields.length > 0 && 'border-b-2 border-black',
        )}
      >
        <div className="truncate">{props.node.simpleNode.name}</div>
        {!props.discovered && (
          <button onClick={onDiscover} disabled={props.loading}>
            {props.loading ? '🔄' : '🔍'}
          </button>
        )}
      </div>
      {props.node.fields.map(({ name, connection }, i) => (
        <div className="relative" key={i}>
          <div className="h-[24px] w-full truncate px-2 leading-[24px]">
            {name}
          </div>
          {connection && (
            <div
              className={classNames(
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
