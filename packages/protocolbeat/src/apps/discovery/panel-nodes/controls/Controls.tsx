import { TooltipProvider } from '../../../../components/Tooltip'
import { useStore } from '../store/store'
import { AutoLayoutMenu } from './canvas/AutoLayoutMenu'
import { HistoryButtons } from './canvas/HistoryButtons'
import { LayoutLibrary } from './canvas/LayoutLibrary'
import { Settings } from './canvas/Settings'
import { ToolButtons } from './canvas/ToolButtons'
import { VisibilityMenu } from './canvas/VisibilityMenu'
import { AlignMenu } from './selection/AlignMenu'
import { ColorButton } from './selection/ColorButton'
import { GroupButtons } from './selection/GroupButtons'
import { HideButton } from './selection/HideButton'
import { SelectionName } from './selection/SelectionName'
import { ValuesButton } from './selection/ValuesButton'
import { Toolbar, ToolbarSection } from './Toolbar'

export function Controls() {
  const hasSelection = useStore((state) => state.selected.length > 0)

  return (
    <TooltipProvider>
      <div className="pointer-events-none absolute inset-x-2 bottom-4 z-10 flex flex-col items-center gap-2">
        {hasSelection && (
          <Toolbar label="Selection">
            <ToolbarSection label="Selected nodes">
              <SelectionName />
            </ToolbarSection>
            <ToolbarSection label="Appearance">
              <ColorButton />
              <ValuesButton />
              <HideButton />
            </ToolbarSection>
            <ToolbarSection label="Arrange">
              <GroupButtons />
              <AlignMenu />
            </ToolbarSection>
          </Toolbar>
        )}
        <Toolbar label="Canvas">
          <ToolbarSection label="Tools">
            <ToolButtons />
          </ToolbarSection>
          <ToolbarSection label="History">
            <HistoryButtons />
          </ToolbarSection>
          <ToolbarSection label="Graph">
            <AutoLayoutMenu />
            <VisibilityMenu />
          </ToolbarSection>
          <ToolbarSection label="Panel">
            <LayoutLibrary />
            <Settings />
          </ToolbarSection>
        </Toolbar>
      </div>
    </TooltipProvider>
  )
}
