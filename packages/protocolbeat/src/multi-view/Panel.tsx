import clsx from 'clsx'
import { ComponentType, Fragment, ReactNode } from 'react'
import { PanelHeader } from './PanelHeader'
import { PanelId, useMultiViewStore } from './store'

export function Panel(props: {
  id: PanelId
  body: ComponentType<{ kind: PanelId }>
}) {
  const hidden = useMultiViewStore(
    (state) => state.fullScreen !== undefined && state.fullScreen !== props.id,
  )
  const isPickedUp = useMultiViewStore((state) => state.pickedUp === props.id)

  const HeaderWrapper = isPickedUp ? HoverHeader : Fragment
  return (
    <div
      className={clsx(
        'flex flex-col border-latte border-r',
        hidden && 'hidden',
      )}
      id={`panel-${props.id}`}
    >
      <HeaderWrapper>
        <PanelHeader id={props.id} />
      </HeaderWrapper>
      <div
        className={clsx(
          // This value has to be updated to account for other element sizes!
          'max-h-[calc(100vh-108px)] flex-1 overflow-y-scroll',
          isPickedUp && 'hidden',
        )}
      >
        <props.body kind={props.id} />
      </div>
      {isPickedUp && <div className="flex-1 bg-slate-100" />}
    </div>
  )
}

function HoverHeader(props: { children: ReactNode }) {
  const mouse = useMultiViewStore((state) => state.mouse)

  return (
    <div
      style={{ left: mouse.x - 100, top: mouse.y - 18 }}
      className="fixed z-10 h-[36px] w-[200px] cursor-move select-none border-black border-x"
    >
      {props.children}
    </div>
  )
}
