import { MouseEventHandler } from 'react'

const RESIZE_DATA_HANDLE = 'resize'

export function ResizeHandle(props: {
  nodeId: string
  onDoubleClick: MouseEventHandler<HTMLDivElement>
}) {
  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation()
    props.onDoubleClick(event)
  }

  return (
    <div
      className="resize-handle group absolute -right-[2px] -bottom-[2px] flex h-[15px] w-[15px] -rotate-45 cursor-nwse-resize flex-col items-center justify-center gap-0.5 bg-clip-padding"
      data-node-id={props.nodeId}
      data-node-operation={RESIZE_DATA_HANDLE}
      onDoubleClick={handleDoubleClick}
    >
      <hr className="pointer-events-none w-[23px] border-t-black group-hover:border-t-gray-500" />
      <hr className="pointer-events-none w-[17px] border-t-black group-hover:border-t-gray-500" />
      <hr className="pointer-events-none w-[11px] border-t-black group-hover:border-t-gray-500" />
    </div>
  )
}

export function isResizeHandle(
  target: EventTarget | null,
): target is HTMLElement {
  return Boolean(
    target instanceof HTMLElement &&
      target.dataset.nodeOperation === RESIZE_DATA_HANDLE &&
      target.dataset.nodeId,
  )
}
