import { useCallback } from 'react'
import { Checkbox } from '../../../../../components/Checkbox'
import { Dialog } from '../../../../../components/Dialog'
import { useStore } from '../../store/store'
import { IconControlGear } from '../icons/IconControlGear'
import { ToolbarButton } from '../ToolbarButton'

export function Settings() {
  const preferences = useStore((state) => state.userPreferences)
  const setPreferences = useStore((state) => state.setPreferences)

  const toggleEnableDimming = useCallback(() => {
    setPreferences({
      enableDimming: !preferences.enableDimming,
    })
  }, [preferences.enableDimming, setPreferences])

  const toggleHideLargeArrays = useCallback(() => {
    setPreferences({
      hideLargeArrays: !preferences.hideLargeArrays,
    })
  }, [preferences.hideLargeArrays, setPreferences])

  const toggleHighlightOverlapping = useCallback(() => {
    setPreferences({
      highlightOverlapping: preferences.highlightOverlapping === false,
    })
  }, [preferences.highlightOverlapping, setPreferences])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <ToolbarButton label="Nodes panel settings">
          <IconControlGear />
        </ToolbarButton>
      </Dialog.Trigger>
      <Dialog.Body>
        <Dialog.Title>Nodes panel settings</Dialog.Title>
        <Dialog.Description>
          Change how nodes are displayed in this panel.
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm hover:text-white"
              onClick={toggleEnableDimming}
            >
              <Checkbox checked={preferences.enableDimming} />
              Enable dimming on selection
            </div>
            <div className="mt-1 pl-6 text-coffee-300 text-xs leading-4">
              When a node is selected, unrelated nodes fade out so its direct
              connections stand out.
            </div>
          </div>
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm hover:text-white"
              onClick={toggleHideLargeArrays}
            >
              <Checkbox checked={preferences.hideLargeArrays} />
              Hide large arrays on load
            </div>
            <div className="mt-1 pl-6 text-coffee-300 text-xs leading-4">
              Fields containing long arrays are collapsed by default to keep
              nodes compact and the graph readable.
            </div>
          </div>
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm hover:text-white"
              onClick={toggleHighlightOverlapping}
            >
              <Checkbox checked={preferences.highlightOverlapping !== false} />
              Highlight overlapping nodes
            </div>
            <div className="mt-1 pl-6 text-coffee-300 text-xs leading-4">
              Draw an accent outline around nodes whose bounding boxes
              intersect, so a smaller node hidden behind a larger one is still
              visible.
            </div>
          </div>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}
