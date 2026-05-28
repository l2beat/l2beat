import clsx from 'clsx'
import { IconClose } from '../../icons/IconClose'
import { IconFullscreen } from '../../icons/IconFullscreen'
import { IconFullscreenExit } from '../../icons/IconFullscreenExit'
import { useDockingHook } from './context'
import type { GroupNode, TabId } from './types'

export function TabGroupView(props: { node: GroupNode }) {
  const useStore = useDockingHook()
  const activeTab = props.node.active
  const fullScreenTab = useStore((state) => state.fullScreenTab)
  const config = useStore((state) => state.config)
  const hiddenByFullScreen =
    fullScreenTab !== undefined && fullScreenTab !== activeTab

  return (
    <div
      className={clsx(
        'flex h-full w-full flex-col bg-coffee-900',
        hiddenByFullScreen && 'hidden',
      )}
      data-group-id={props.node.id}
    >
      <TabStrip node={props.node} />
      <div
        className="relative min-h-0 flex-1 overflow-auto"
        data-group-body-id={props.node.id}
      >
        {config.renderBody(activeTab)}
      </div>
    </div>
  )
}

function TabStrip(props: { node: GroupNode }) {
  const useStore = useDockingHook()
  const config = useStore((state) => state.config)
  const activeTab = useStore((state) => state.activeTab)
  const pickedUpTab = useStore((state) => state.pickedUpTab)
  const fullScreenTab = useStore((state) => state.fullScreenTab)
  const toggleFullScreen = useStore((state) => state.toggleFullScreen)
  const removeTab = useStore((state) => state.removeTab)

  const groupActive = props.node.active
  const isFullScreen = fullScreenTab === groupActive

  return (
    <div
      className="group/strip flex h-[36px] shrink-0 select-none items-stretch border-coffee-600 border-y bg-coffee-800"
      data-tab-strip-group-id={props.node.id}
    >
      <div className="flex flex-1 items-stretch overflow-x-auto">
        {props.node.tabs.map((tab) => (
          <Tab
            key={tab}
            tabId={tab}
            isActive={tab === groupActive}
            isFocused={tab === activeTab && tab === groupActive}
            isPickedUp={tab === pickedUpTab}
            groupId={props.node.id}
            removeTab={removeTab}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 px-2">
        {config.renderTabExtras?.({ id: groupActive, groupId: props.node.id })}
        <button
          type="button"
          className="w-4 text-coffee-200 hover:text-coffee-100"
          onClick={() => toggleFullScreen(groupActive)}
          aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'}
        >
          {isFullScreen ? <IconFullscreenExit /> : <IconFullscreen />}
        </button>
      </div>
    </div>
  )
}

function Tab(props: {
  tabId: TabId
  isActive: boolean
  isFocused: boolean
  isPickedUp: boolean
  groupId: string
  removeTab: (id?: TabId) => void
}) {
  const useStore = useDockingHook()
  const config = useStore((state) => state.config)
  return (
    <div
      data-tab-id={props.tabId}
      data-tab-group-id={props.groupId}
      className={clsx(
        'group/tab flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-1 font-bold text-xs uppercase',
        props.isFocused
          ? 'border-coffee-200 bg-coffee-700 text-coffee-100'
          : props.isActive
            ? 'border-transparent bg-coffee-700 text-coffee-100'
            : 'border-transparent text-coffee-200 hover:bg-coffee-700/40',
        props.isPickedUp && 'opacity-40',
      )}
    >
      <span className="pointer-events-none flex items-center gap-1.5">
        {config.renderTabLabel(props.tabId)}
      </span>
      <button
        type="button"
        className="hidden h-4 w-4 items-center justify-center text-coffee-300 hover:text-coffee-100 group-hover/tab:flex"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          props.removeTab(props.tabId)
        }}
        aria-label="Close tab"
      >
        <IconClose className="size-3" />
      </button>
    </div>
  )
}
