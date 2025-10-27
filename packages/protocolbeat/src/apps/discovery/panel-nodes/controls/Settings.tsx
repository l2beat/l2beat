import { useCallback, useState } from 'react'
import { Checkbox } from '../../../../components/Checkbox'
import { IconGear } from '../../../../icons/IconGear'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

type SettingsButtonProps = {
  onClick: () => void
}

export function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((state) => !state)

  return (
    <>
      <SettingsButton onClick={toggle} />
      {isOpen && <SettingsTray />}
    </>
  )
}

export function SettingsTray() {
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
    <div className="-translate-x-1/2 absolute bottom-8 left-2/3 flex flex-col gap-2 rounded bg-black p-2 shadow-[0_10px_20px_-10px_#00000088]">
      <div className="flex flex-col gap-1">
        <ControlButton
          onClick={toggleHideUnknowns}
          className="flex items-center gap-1"
        >
          <Checkbox
            checked={preferences.hideUnknownOnLoad}
            onClick={toggleHideUnknowns}
          />
          <span>Hide unknowns on load</span>
        </ControlButton>
        <ControlButton
          onClick={toggleEnableDimming}
          className="flex items-center gap-1"
        >
          <Checkbox
            checked={preferences.enableDimming}
            onClick={toggleEnableDimming}
          />
          <span>Enable dimming on selection</span>
        </ControlButton>
        <ControlButton
          onClick={toggleHideLargeArrays}
          className="flex items-center gap-1"
        >
          <Checkbox
            checked={preferences.hideLargeArrays}
            onClick={toggleHideLargeArrays}
          />
          <span>Hide large arrays on load</span>
        </ControlButton>
      </div>
    </div>
  )
}

export function SettingsButton(props: SettingsButtonProps) {
  return (
    <ControlButton onClick={props.onClick}>
      <IconGear />
    </ControlButton>
  )
}
