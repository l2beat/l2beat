import { ClearButton } from './ClearButton'
import { ColorButton } from './ColorButton'
import { FastLayoutButton } from './FastLayoutButton'
import { HideButton } from './HideButton'
import { ShowButton } from './ShowButton'
import { SlowLayoutButton } from './SlowLayoutButton'

interface ControlsProps {
  panelMode: boolean
}

export function Controls(props: ControlsProps) {
  return (
    <div className="-translate-x-1/2 absolute bottom-8 left-1/2 flex select-none items-center gap-1 border border-latte bg-coffee p-2 shadow-xl">
      <SlowLayoutButton />
      <FastLayoutButton />
      <span className="text-latte">|</span>
      <ShowButton />
      <HideButton />
      <ColorButton />
      {!props.panelMode && (
        <>
          <span className="text-latte">|</span>
          <ClearButton />
        </>
      )}
    </div>
  )
}
