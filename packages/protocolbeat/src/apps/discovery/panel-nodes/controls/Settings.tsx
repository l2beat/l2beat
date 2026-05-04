import { useCallback } from 'react'
import { Checkbox } from '../../../../components/Checkbox'
import { Dialog } from '../../../../components/Dialog'
import { IconGear } from '../../../../icons/IconGear'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function Settings() {
  const preferences = useStore((state) => state.userPreferences)
  const setPreferences = useStore((state) => state.setPreferences)

  const toggleHideUnknowns = useCallback(() => {
    setPreferences({
      hideUnknownOnLoad: !preferences.hideUnknownOnLoad,
    })
  }, [preferences.hideUnknownOnLoad, setPreferences])

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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild className="max-w-fit">
        <ControlButton>
          <IconGear />
        </ControlButton>
      </Dialog.Trigger>
      <Dialog.Body>
        <Dialog.Title className="m-0 font-medium text-lg">
          Nodes panel settings
        </Dialog.Title>
        <Dialog.Description className="mb-5 text-sm leading-normal">
          Change how nodes are displayed in this panel.
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-1 font-light text-sm hover:underline"
              onClick={toggleHideUnknowns}
            >
              <Checkbox checked={preferences.hideUnknownOnLoad} />
              Hide unknowns on load
            </div>
            <div className="pl-5 font-light text-coffee-400 text-xs">
              Nodes representing unverified or unidentified contracts start
              hidden when the panel opens. Reveal them later via the show
              controls.
            </div>
          </div>
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-1 font-light text-sm hover:underline"
              onClick={toggleEnableDimming}
            >
              <Checkbox checked={preferences.enableDimming} />
              Enable dimming on selection
            </div>
            <div className="pl-5 font-light text-coffee-400 text-xs">
              When a node is selected, unrelated nodes fade out so its direct
              connections stand out.
            </div>
          </div>
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-1 font-light text-sm hover:underline"
              onClick={toggleHideLargeArrays}
            >
              <Checkbox checked={preferences.hideLargeArrays} />
              Hide large arrays on load
            </div>
            <div className="pl-5 font-light text-coffee-400 text-xs">
              Fields containing long arrays are collapsed by default to keep
              nodes compact and the graph readable.
            </div>
          </div>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}
