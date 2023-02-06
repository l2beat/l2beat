import classNames from 'classnames'
import { useCallback } from 'react'

import { Node } from './utils/State'

export interface NodeViewProps {
  node: Node
  selected: boolean
  discovered: boolean
  onDiscover: (nodeId: string) => void
  loading: boolean
}

export function NodeView(props: NodeViewProps) {
  const onDiscover = useCallback(() => {
    props.onDiscover(props.node.id)
  }, [props.onDiscover, props.node.id])

  return (
    <div
      style={{
        left: props.node.box.x,
        top: props.node.box.y,
        width: props.node.box.width,
        height: props.node.box.height,
      }}
      className={classNames(
        'absolute rounded-md border-2 border-black bg-white',
        props.selected && 'outline-indigo-300 outline outline-4',
        props.discovered ? 'bg-white' : 'bg-yellow-300',
      )}
    >
      <div
        className={classNames(
          'w-full flex justify-between px-2 h-[28px] leading-[28px]',
          props.node.fields.length > 0 && 'border-b-2 border-black',
        )}
      >
        <div className="truncate">{props.node.name}</div>
        {!props.discovered && (
          <button onClick={onDiscover} disabled={props.loading}>
            {props.loading ? '🔄' : '🔍'}
          </button>
        )}
      </div>
      {props.node.fields.map(({ name, connection }, i) => (
        <div className="relative" key={i}>
          <div className="w-full truncate px-2 h-[24px] leading-[24px]">
            {name}
          </div>
          {connection && (
            <div
              className={classNames(
                'absolute w-[12px] h-[12px]',
                'bg-white border-2 border-black rounded-full',
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
    </div>
  )
}
