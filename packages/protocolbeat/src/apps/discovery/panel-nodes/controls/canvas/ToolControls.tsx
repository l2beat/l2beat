import type { ReactNode } from 'react'
import { IconCursor } from '../../../../../icons/IconCursor'
import { IconHand } from '../../../../../icons/IconHand'
import type { Tool } from '../../store/State'
import { useStore } from '../../store/store'
import { HAND_TOOL_KEY, SELECT_TOOL_KEY } from '../../store/utils/constants'
import { effectiveTool } from '../../store/utils/tool'
import { ControlGroup } from '../ControlGroup'
import { ToolbarButton } from '../ToolbarButton'

const TOOLS: {
  tool: Tool
  shortcut: string
  label: string
  description?: string
  icon: ReactNode
}[] = [
  {
    tool: 'select',
    shortcut: SELECT_TOOL_KEY.toUpperCase(),
    label: 'Selection tool',
    icon: <IconCursor />,
  },
  {
    tool: 'hand',
    shortcut: HAND_TOOL_KEY.toUpperCase(),
    label: 'Hand tool',
    description:
      'Drag to move the view. Space + drag or middle mouse drag also pans.',
    icon: <IconHand />,
  },
]

export function ToolControls() {
  // Holding space borrows the hand tool, so highlight it while the key is down.
  const active = useStore(effectiveTool)
  const setTool = useStore((state) => state.setTool)

  return (
    <ControlGroup>
      {TOOLS.map(({ tool, shortcut, label, description, icon }) => (
        <ToolbarButton
          key={tool}
          label={label}
          description={description}
          shortcut={[shortcut]}
          active={active === tool}
          onClick={() => setTool(tool)}
        >
          {icon}
        </ToolbarButton>
      ))}
    </ControlGroup>
  )
}
