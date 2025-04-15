import { ClearButton } from './ClearButton'
import { ClusterLayoutButton } from './ClusterLayoutButton'
import { ColorButton } from './ColorButton'
import { HideButton } from './HideButton'
import { HideUnknownsButton } from './HideUnknowns'
import { Settings } from './Settings'
import { ShowButton } from './ShowButton'
import { StackLayoutButton } from './StackLayoutButton'
import { ValuesButton } from './ValuesButton'

interface ControlsProps {
  panelMode: boolean
}

export function Controls(props: ControlsProps) {
  return (
    <div className="-translate-x-1/2 absolute bottom-8 left-1/2 flex select-none items-center gap-1 rounded bg-black p-2 shadow-[0_10px_20px_-10px_#00000088]">
      <div className="flex flex-col gap-2 md:flex-row">
        <ClusterLayoutButton />
        <StackLayoutButton />
      </div>
      <span className="text-coffee-600">|</span>
      <div className="flex flex-col gap-2 md:flex-row">
        <ShowButton />
        <div className="flex gap-1">
          <HideUnknownsButton />
          {props.panelMode && <Settings />}
        </div>
      </div>
      <span className="text-coffee-600">|</span>

      <div className="flex flex-col gap-2 md:flex-row">
        <HideButton />
        <ColorButton />
        <ValuesButton />
        {!props.panelMode && (
          <>
            <span className="text-coffee-600">|</span>
            <ClearButton />
          </>
        )}
      </div>
    </div>
  )
}
