import { ClearButton } from './ClearButton'
import { ColorButton } from './ColorButton'
import { StackLayoutButton } from './StackLayoutButton'
import { HideButton } from './HideButton'
import { ShowButton } from './ShowButton'
import { ClusterLayoutButton } from './ClusterLayoutButton'

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
