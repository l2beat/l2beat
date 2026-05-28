import clsx from 'clsx'
import { IconClose } from '../../icons/IconClose'
import { IconFullscreen } from '../../icons/IconFullscreen'
import { IconFullscreenExit } from '../../icons/IconFullscreenExit'
import { useDockingHook } from './context'
import type { LeafNode } from './types'

export function LeafView(props: { node: LeafNode }) {
  const useStore = useDockingHook()
  const config = useStore((state) => state.config)
  const activeTab = useStore((state) => state.activeTab)
  const fullScreenTab = useStore((state) => state.fullScreenTab)
  const pickedUpTab = useStore((state) => state.pickedUpTab)
  const toggleFullScreen = useStore((state) => state.toggleFullScreen)
  const removeTab = useStore((state) => state.removeTab)

  const hiddenByFullScreen =
    fullScreenTab !== undefined && fullScreenTab !== props.node.tab
  const isActive = activeTab === props.node.tab
  const isFullScreen = fullScreenTab === props.node.tab
  const isPickedUp = pickedUpTab === props.node.tab

  return (
    <div
      className={clsx(
        'flex h-full w-full flex-col bg-coffee-900',
        hiddenByFullScreen && 'hidden',
        isPickedUp && 'opacity-50',
      )}
    >
      <div
        data-leaf-id={props.node.id}
        data-leaf-tab={props.node.tab}
        className={clsx(
          'flex h-[36px] shrink-0 select-none items-center gap-2 border-coffee-600 border-y bg-coffee-800 px-3',
          'cursor-move',
        )}
      >
        <div
          className={clsx(
            'pointer-events-none flex flex-1 items-center gap-1.5 font-bold text-xs uppercase',
            isActive ? 'text-coffee-100' : 'text-coffee-200',
          )}
        >
          {config.renderTabLabel(props.node.tab)}
        </div>
        <div className="flex items-center gap-1">
          {config.renderTabExtras?.({
            id: props.node.tab,
            leafId: props.node.id,
          })}
          <button
            type="button"
            className="w-4 text-coffee-200 hover:text-coffee-100"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => toggleFullScreen(props.node.tab)}
            aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'}
          >
            {isFullScreen ? <IconFullscreenExit /> : <IconFullscreen />}
          </button>
          <button
            type="button"
            className="w-4 text-coffee-200 hover:text-coffee-100"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => removeTab(props.node.tab)}
            aria-label="Close panel"
          >
            <IconClose />
          </button>
        </div>
      </div>
      <div
        className="relative min-h-0 flex-1 overflow-auto"
        data-leaf-body-id={props.node.id}
      >
        {config.renderBody(props.node.tab)}
      </div>
    </div>
  )
}
