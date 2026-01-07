import { Checkbox } from '../../../components/Checkbox'
import { Dialog } from '../../../components/Dialog'
import { IconGear } from '../../../icons/IconGear'
import { useGlobalSettingsStore } from '../store/global-settings-store'

export function SettingsDialog() {
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const setUserSettings = useGlobalSettingsStore((s) => s.setUserSettings)

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconGear />
      </Dialog.Trigger>
      <Dialog.Body>
        <Dialog.Title className="m-0 font-medium text-lg">
          Global app settings
        </Dialog.Title>
        <Dialog.Description className="mb-5 text-sm leading-normal">
          Change the way the app behaves.
        </Dialog.Description>

        <div className="flex flex-col">
          <h2 className="leading-none">Visuals</h2>
          <hr className="mt-1 mb-2 border-coffee-400/30" />
          <div>
            <div
              className="flex cursor-pointer select-none items-center gap-1 font-light text-sm hover:underline"
              onClick={() =>
                setUserSettings({
                  markUnreachableEntries: !markUnreachableEntries,
                })
              }
            >
              <Checkbox checked={markUnreachableEntries} />
              Make unreachable entries distinctive
            </div>
            <div className="flex items-center gap-1 pl-5 font-light text-coffee-400 text-xs">
              Entries unreachable from the root discovery will appear grayed
              out. <br />
              By default, all entries are displayed as if they were reachable.
            </div>
          </div>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}
