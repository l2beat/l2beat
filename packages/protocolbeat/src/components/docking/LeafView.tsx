import clsx from 'clsx'
import { memo } from 'react'
import { IconClose } from '../../icons/IconClose'
import { IconFullscreen } from '../../icons/IconFullscreen'
import { IconFullscreenExit } from '../../icons/IconFullscreenExit'
import { useDockingHook } from './context'
import type { LeafNode } from './types'

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
  const config = useStore((state) => state.config)
  const activeLeaf = useStore((state) => state.activeLeaf)
  const fullScreenLeaf = useStore((state) => state.fullScreenLeaf)
  const pickedUpLeaf = useStore((state) => state.pickedUpLeaf)
  const toggleFullScreen = useStore((state) => state.toggleFullScreen)
  const removeLeaf = useStore((state) => state.removeLeaf)

  const key = props.node.key
  const isActive = activeLeaf === key
  const isFullScreen = fullScreenLeaf === key
  const isPickedUp = pickedUpLeaf === key

  return (
    <div
      data-leaf-key={key}
      className={clsx(
        'flex h-full w-full flex-col bg-coffee-900',
        isPickedUp && 'opacity-50',
      )}
    >
      <div
        data-leaf-handle={key}
        className="flex h-[36px] shrink-0 cursor-move select-none items-center gap-2 border-coffee-600 border-y bg-coffee-800 pr-2"
      >
        {config.renderHeader({ key, isActive, isFullScreen })}
        <button
          type="button"
          className="w-4 text-coffee-200 hover:text-coffee-100"
          onClick={() => toggleFullScreen(key)}
          aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'}
        >
          {isFullScreen ? <IconFullscreenExit /> : <IconFullscreen />}
        </button>
        <button
          type="button"
          className="w-4 text-coffee-200 hover:text-coffee-100"
          onClick={() => removeLeaf(key)}
          aria-label="Close panel"
        >
          <IconClose />
        </button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-auto">
        {config.renderBody(key)}
      </div>
    </div>
  )
}
