import type { ReactNode } from 'react'
import { IconCursor } from '../../../../icons/IconCursor'
import { IconHand } from '../../../../icons/IconHand'
import type { Tool } from '../store/State'
import { useStore } from '../store/store'
import { HAND_TOOL_KEY, SELECT_TOOL_KEY } from '../store/utils/constants'
import { effectiveTool } from '../store/utils/tool'
import { ControlButton } from './ControlButton'
import { ControlGroup } from './ControlGroup'

const TOOLS: {
  tool: Tool
  shortcut: string
  label: string
  title: string
  icon: ReactNode
}[] = [
  {
    tool: 'select',
    shortcut: SELECT_TOOL_KEY.toUpperCase(),
    label: 'Selection tool',
    title: 'Selection tool (V)',
    icon: <IconCursor />,
  },
  {
    tool: 'hand',
    shortcut: HAND_TOOL_KEY.toUpperCase(),
    label: 'Hand tool',
    title:
      'Hand tool (H): drag to move the view. Space + drag or middle mouse drag also pans.',
    icon: <IconHand />,
  },
]

export function ToolControls() {
  // Holding space borrows the hand tool, so highlight it while the key is down.
  const active = useStore(effectiveTool)
  const setTool = useStore((state) => state.setTool)

  return (
    <ControlGroup>
      {TOOLS.map(({ tool, shortcut, label, title, icon }) => (
        <ControlButton
          key={tool}
          title={title}
          aria-label={label}
          active={active === tool}
          onClick={() => setTool(tool)}
          className="relative px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            {icon}
          </span>
          <span
            aria-hidden
            className="absolute right-1 bottom-0.5 font-medium text-2xs text-coffee-400 leading-none"
          >
            {shortcut}
          </span>
        </ControlButton>
      ))}
    </ControlGroup>
  )
}
