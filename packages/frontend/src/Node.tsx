import classNames from 'classnames'
import { useEffect, useRef } from 'react'

import { Connection, ConnectionProps } from './Connection'
import { Drag } from './viewport/drag'

export interface NodeProps {
  id: string
  position: {
    x: number
    y: number
  }
  onTranslate?: (id: string, position: { x: number; y: number }) => void
  onDiscover?: () => void
  onSelect?: () => void
  loading: boolean
  selected: boolean
  width: number
  name: string
  fields: Field[]
}

interface Field {
  name: string
  value?: string
  connection?: {
    x: number
    y: number
    width: number
  }
}

export function Node(props: NodeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastX = 0
    let lastY = 0
    function reset() {
      lastX = 0
      lastY = 0
    }
    if (ref.current) {
      const drag = new Drag(
        ref.current,
        (x, y) => {
          props.onTranslate?.(props.id, { x: x - lastX, y: y - lastY })
          lastX = x
          lastY = y
        },
        reset,
        reset,
      )
      return () => drag.destroy()
    }
  }, [props.id, props.onTranslate])

  const fields = props.fields.map((field, index) => ({
    ...field,
    connection: processConnection(field, index, props.position, props.width),
  }))

  return (
    <div
      onClick={props.onSelect}
      ref={ref}
      style={{
        left: props.position.x,
        top: props.position.y,
        width: props.width,
      }}
      className={classNames(
        'absolute',
        'drop-shadow-lg rounded-md border-2 border-black cursor-pointer',
        props.onDiscover ? 'bg-yellow-300' : 'bg-white',
        props.selected && 'outline-indigo-300 outline outline-4',
      )}
    >
      <div
        className={classNames(
          'w-full flex justify-between px-2 h-[28px] leading-[28px]',
          fields.length > 0 && 'border-b-2 border-black',
        )}
      >
        <div className="truncate">{props.name}</div>
        {props.onDiscover && (
          <button onClick={props.onDiscover} disabled={props.loading}>
            {props.loading ? '🔄' : '🔍'}
          </button>
        )}
      </div>
      {fields.map((field, i) => (
        <div className="w-full truncate px-2 h-[24px] leading-[24px]" key={i}>
          {field.name}
          {field.connection && (
            <Connection from={field.connection.from} to={field.connection.to} />
          )}
        </div>
      ))}
    </div>
  )
}

function processConnection(
  field: Field,
  index: number,
  position: { x: number; y: number },
  width: number,
): ConnectionProps | undefined {
  if (!field.connection) {
    return
  }

  const HEADER_HEIGHT = 28
  const BORDER_WIDTH = 2
  const FIELD_HEIGHT = 24
  const y = HEADER_HEIGHT + FIELD_HEIGHT * (index + 0.5)

  const left = -BORDER_WIDTH / 2
  const right = width - BORDER_WIDTH * 2 + BORDER_WIDTH / 2

  const to = {
    x1: field.connection.x - position.x - BORDER_WIDTH,
    x2: field.connection.x - position.x - BORDER_WIDTH + field.connection.width,
    y: field.connection.y - position.y,
  }

  const leftToLeft = Math.abs(to.x1 - left)
  const leftToRight = Math.abs(to.x2 - left)
  const rightToLeft = Math.abs(to.x1 - right)
  const rightToRight = Math.abs(to.x2 - right)

  const min = Math.min(leftToLeft, leftToRight, rightToLeft, rightToRight)

  if (min === leftToLeft) {
    return {
      from: { x: left, y, direction: 'left' },
      to: { x: to.x1, y: to.y, direction: 'left' },
    }
  } else if (min === leftToRight) {
    return {
      from: { x: left, y, direction: 'left' },
      to: { x: to.x2, y: to.y, direction: 'right' },
    }
  } else if (min === rightToLeft) {
    return {
      from: { x: right, y, direction: 'right' },
      to: { x: to.x1, y: to.y, direction: 'left' },
    }
  } else if (min === rightToRight) {
    return {
      from: { x: right, y, direction: 'right' },
      to: { x: to.x2, y: to.y, direction: 'right' },
    }
  }
}
