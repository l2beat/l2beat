import clsx from 'clsx'
import { type ComponentType, Fragment, type ReactNode } from 'react'
import { PanelHeader } from './PanelHeader'
import { type PanelId, useMultiViewStore } from './store'

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
        'flex max-w-[100vw] flex-col border-coffee-600 md:border-r',
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
          'max-h-[calc(100vh-108px)] flex-1 overflow-y-auto',
          isPickedUp && 'hidden',
        )}
      >
        <props.body kind={props.id} />
      </div>
      {isPickedUp && (
        <div className="flex-1 bg-coffee-800 p-4">
          <div className="h-full w-full border border-coffee-200" />
        </div>
      )}
    </div>
  )
}

function HoverHeader(props: { children: ReactNode }) {
  const mouse = useMultiViewStore((state) => state.mouse)

  return (
    <div
      style={{ left: mouse.x - 100, top: mouse.y - 18 }}
      className="fixed z-10 h-[36px] w-[200px] cursor-move select-none border-coffee-600 border-x"
    >
      {props.children}
    </div>
  )
}
