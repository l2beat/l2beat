import { memo } from 'react'
import { IconClose } from '../../icons/IconClose'
import { IconFullscreen } from '../../icons/IconFullscreen'
import { IconFullscreenExit } from '../../icons/IconFullscreenExit'
import { cn } from '../../utils/cn'
import { useDockingHook } from './context'
import type { LeafKey, LeafNode } from './types'

// The generic frame. Docking owns the header bar (drag handle + fullscreen +
// close) and the body container; the consumer fills both via renderHeader /
// renderBody and never has to wire the move/fullscreen/close I/O itself.
//
// Memoized on the leaf key (a leaf node is only its key): every resize
// pointermove produces a new tree, and without this the prop cascade would
// re-render every panel body at pointer rate. Focus/fullscreen/drag updates
// still flow through the store hooks below.
export const LeafView = memo(
  LeafViewImpl,
  (prev, next) => prev.node.key === next.node.key,
)

function LeafViewImpl(props: { node: LeafNode }) {
  const useStore = useDockingHook()
  const key = props.node.key
  const config = useStore((state) => state.config)
  const isPickedUp = useStore((state) => state.pickedUpLeaf === key)

  return (
    <div
      data-leaf-key={key}
      className={cn(
        'flex h-full w-full flex-col bg-coffee-900',
        isPickedUp && 'opacity-50',
      )}
    >
      <LeafHeader leafKey={key} />
      <div className="relative min-h-0 flex-1 overflow-auto">
        {config.renderBody(key)}
      </div>
    </div>
  )
}

// Focus and fullscreen change on clicks between panels; reading them here
// keeps those clicks from rerendering every panel body.
function LeafHeader(props: { leafKey: LeafKey }) {
  const useStore = useDockingHook()
  const key = props.leafKey
  const config = useStore((state) => state.config)
  const isActive = useStore((state) => state.activeLeaf === key)
  const isFullScreen = useStore((state) => state.fullScreenLeaf === key)
  const toggleFullScreen = useStore((state) => state.toggleFullScreen)
  const removeLeaf = useStore((state) => state.removeLeaf)

  return (
    <div
      data-leaf-handle={key}
      className={cn(
        'flex h-8 shrink-0 cursor-move select-none items-center gap-0.5 border-coffee-700 border-t-2 border-b bg-coffee-800 pr-1',
        isActive ? 'border-t-autumn-300' : 'border-t-transparent',
      )}
    >
      {config.renderHeader({ key, isActive, isFullScreen })}
      <button
        type="button"
        className="flex size-6 items-center justify-center rounded-sm text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100"
        onClick={() => toggleFullScreen(key)}
        aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'}
      >
        {isFullScreen ? <IconFullscreenExit /> : <IconFullscreen />}
      </button>
      <button
        type="button"
        className="flex size-6 items-center justify-center rounded-sm text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100"
        onClick={() => removeLeaf(key)}
        aria-label="Close panel"
      >
        <IconClose />
      </button>
    </div>
  )
}
