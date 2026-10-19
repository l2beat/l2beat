import { ControlGroup } from './ControlGroup'
import { AutoLayoutMenu } from './canvas/AutoLayoutMenu'
import { LayoutLibrary } from './canvas/LayoutLibrary'
import { RedoButton } from './canvas/RedoButton'
import { Settings } from './canvas/Settings'
import { ToolControls } from './canvas/ToolControls'
import { UndoButton } from './canvas/UndoButton'
import { VisibilityMenu } from './canvas/VisibilityMenu'
import { AlignMenu } from './selection/AlignMenu'
import { ColorButton } from './selection/ColorButton'
import { GroupControls } from './selection/GroupControls'
import { HideButton } from './selection/HideButton'
import { ValuesButton } from './selection/ValuesButton'

export function Controls() {
  return (
    <div className="absolute inset-x-2 bottom-4 z-10 flex justify-center">
      <div className="flex max-w-full flex-wrap justify-center gap-2 pb-1">
        <ToolControls />
        <ControlGroup>
          <UndoButton />
          <RedoButton />
          <AutoLayoutMenu />
        </ControlGroup>
        <ControlGroup>
          <VisibilityMenu />
        </ControlGroup>
        <ControlGroup>
          <GroupControls />
          <AlignMenu />
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
