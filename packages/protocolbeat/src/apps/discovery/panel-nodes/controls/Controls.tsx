import { ControlGroup } from './ControlGroup'
import { ClusterLayoutButton } from './canvas/ClusterLayoutButton'
import { HideNodesButton } from './canvas/HideNodesButton'
import { LayoutLibrary } from './canvas/LayoutLibrary'
import { RedoButton } from './canvas/RedoButton'
import { Settings } from './canvas/Settings'
import { ShowButton } from './canvas/ShowButton'
import { StackLayoutButton } from './canvas/StackLayoutButton'
import { ToolControls } from './canvas/ToolControls'
import { UndoButton } from './canvas/UndoButton'
import { AlignControls } from './selection/AlignControls'
import { ColorButton } from './selection/ColorButton'
import { GroupControls } from './selection/GroupControls'
import { HideButton } from './selection/HideButton'
import { ValuesButton } from './selection/ValuesButton'

export function Controls() {
  return (
    <div className="absolute inset-x-2 bottom-4 z-10 flex justify-center">
      <div className="flex max-w-full flex-wrap justify-center gap-2 pb-1">
        <AlignControls />
        <ToolControls />
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
          <Settings />
          <LayoutLibrary />
        </ControlGroup>
      </div>
    </div>
  )
}
