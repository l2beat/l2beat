import { ClusterLayoutButton } from './ClusterLayoutButton'
import { ColorButton } from './ColorButton'
import { HideButton } from './HideButton'
import { HideUnknownsButton } from './HideUnknowns'
import { HideUnreachableButton, ShowUnreachableButton } from './HideUnreachable'
import { LayoutFileButtons } from './LayoutFileButtons'
import { RedoButton } from './RedoButton'
import { Settings } from './Settings'
import { ShowButton } from './ShowButton'
import { StackLayoutButton } from './StackLayoutButton'
import { UndoButton } from './UndoButton'
import { ValuesButton } from './ValuesButton'

export function Controls() {
  return (
    <div className="-translate-x-1/2 absolute bottom-8 left-1/2 flex select-none items-center gap-1 rounded bg-black p-2 shadow-[0_10px_20px_-10px_#00000088]">
      <div className="flex flex-col gap-1">
        <UndoButton />
        <RedoButton />
      </div>
      <span className="text-coffee-600">|</span>
      <div className="flex flex-col gap-1 self-stretch">
        <ClusterLayoutButton className="flex flex-1 items-center justify-center" />
        <StackLayoutButton className="flex flex-1 items-center justify-center" />
      </div>
      <span className="text-coffee-600">|</span>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <ShowButton />
        </div>

        <HideUnknownsButton />
        <div className="flex gap-1">
          <HideUnreachableButton />
          <ShowUnreachableButton />
        </div>
      </div>
      <span className="text-coffee-600">|</span>

      <div className="flex flex-col gap-1">
        <HideButton />
        <ColorButton />
        <ValuesButton />
      </div>
      <span className="text-coffee-600">|</span>
      <div className="flex flex-col gap-1">
        <Settings />
        <LayoutFileButtons />
      </div>
    </div>
  )
}
