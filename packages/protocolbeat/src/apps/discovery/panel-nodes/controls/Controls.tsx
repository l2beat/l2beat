import { AlignControls } from './AlignControls'
import { ClusterLayoutButton } from './ClusterLayoutButton'
import { ColorButton } from './ColorButton'
import { ControlGroup } from './ControlGroup'
import { GroupControls } from './GroupControls'
import { HideButton } from './HideButton'
import { HideNodesButton } from './HideNodesButton'
import { LayoutLibrary } from './LayoutLibrary'
import { RedoButton } from './RedoButton'
import { Settings } from './Settings'
import { ShowButton } from './ShowButton'
import { StackLayoutButton } from './StackLayoutButton'
import { UndoButton } from './UndoButton'
import { ValuesButton } from './ValuesButton'

export function Controls() {
  return (
    <div className="absolute inset-x-2 bottom-4 z-10 flex justify-center">
      <div className="flex max-w-full flex-wrap justify-center gap-2 pb-1">
        <AlignControls />
        <ControlGroup>
          <UndoButton />
          <RedoButton />
          <ClusterLayoutButton />
          <StackLayoutButton />
        </ControlGroup>
        <ControlGroup>
          <ShowButton />
          <HideNodesButton />
        </ControlGroup>
        <ControlGroup>
          <GroupControls />
          <HideButton />
          <ColorButton />
          <ValuesButton />
          <Settings className="px-2.5" />
          <LayoutLibrary className="px-2.5" />
        </ControlGroup>
      </div>
    </div>
  )
}
