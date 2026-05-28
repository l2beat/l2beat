import * as RadixSelect from '@radix-ui/react-select'
import clsx from 'clsx'
import { IconChecked } from '../../icons/IconChcked'
import { IconChevronDown } from '../../icons/IconChevronDown'
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
  const changeTab = useStore((state) => state.changeTab)

  const hiddenByFullScreen =
    fullScreenTab !== undefined && fullScreenTab !== props.node.tab
  const isActive = activeTab === props.node.tab
  const isFullScreen = fullScreenTab === props.node.tab
  const isPickedUp = pickedUpTab === props.node.tab

  const filter = config.filterTab ?? (() => true)
  const availableTabs = config.availableTabs.filter(filter)

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
        className="flex h-[36px] shrink-0 cursor-move select-none items-center gap-2 border-coffee-600 border-y bg-coffee-800 pr-2"
      >
        <RadixSelect.Root
          value={props.node.tab}
          onValueChange={(v) => changeTab(props.node.id, v)}
        >
          <RadixSelect.Trigger
            aria-label="Panel"
            onMouseDown={(e) => e.stopPropagation()}
            className={clsx(
              'group/sel inline-flex h-[26px] items-center gap-1.5 border-b px-3 font-bold text-xs uppercase outline-none transition-colors focus-visible:outline-none',
              isActive
                ? 'border-coffee-200 text-coffee-100'
                : 'border-transparent text-coffee-200 hover:text-coffee-100',
            )}
          >
            <span className="flex items-center gap-1.5">
              {config.renderTabLabel(props.node.tab)}
            </span>
            <IconChevronDown className="ml-auto size-3 opacity-60 transition-transform group-data-[state=open]/sel:rotate-180" />
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={4}
              className="z-[1000] cursor-default select-none border border-coffee-500 bg-coffee-800 font-bold text-coffee-200 text-xs uppercase shadow-lg"
            >
              <RadixSelect.Viewport>
                {availableTabs.map((id) => (
                  <RadixSelect.Item
                    key={id}
                    value={id}
                    className="relative flex cursor-pointer items-center gap-2.5 py-2 pr-9 pl-2.5 outline-none focus-visible:outline-none data-[highlighted]:bg-coffee-600 data-[highlighted]:text-coffee-100"
                  >
                    <span className="flex items-center gap-1.5">
                      {config.renderTabLabel(id)}
                    </span>
                    <RadixSelect.ItemIndicator className="absolute right-2.5">
                      <IconChecked className="size-3" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
        <div className="flex-1" />
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
        className="relative min-h-0 flex-1"
        data-leaf-body-id={props.node.id}
        data-body-placeholder={props.node.tab}
      />
    </div>
  )
}
