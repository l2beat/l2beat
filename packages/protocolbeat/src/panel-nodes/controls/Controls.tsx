import { ClearButton } from './ClearButton'
import { ClusterLayoutButton } from './ClusterLayoutButton'
import { ColorButton } from './ColorButton'
import { HideButton } from './HideButton'
import { HideUnknownsButton } from './HideUnknowns'
import { Settings } from './Settings'
import { ShowButton } from './ShowButton'
import { StackLayoutButton } from './StackLayoutButton'

interface ControlsProps {
  panelMode: boolean
}

export function Controls(props: ControlsProps) {
  return (
    <div className="-translate-x-1/2 absolute bottom-8 left-1/2 flex select-none items-center gap-1 rounded bg-black p-2 shadow-[0_10px_20px_-10px_#00000088]">
      <ClusterLayoutButton />
      <StackLayoutButton />
      <span className="text-coffee-600">|</span>
      <ShowButton />
      <HideUnknownsButton />
      {props.panelMode && <Settings />}
      <span className="text-coffee-600">|</span>
      <HideButton />
      <ColorButton />
      {!props.panelMode && (
        <>
          <span className="text-coffee-600">|</span>
          <ClearButton />
        </>
      )}
    </div>
  )
}
