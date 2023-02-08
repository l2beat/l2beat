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
        <div className="truncate">{props.node.name}</div>
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
    </div>
  )
}
