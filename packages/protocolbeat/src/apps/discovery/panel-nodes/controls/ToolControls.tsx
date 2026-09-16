import type { ReactNode } from 'react'
import { IconCursor } from '../../../../icons/IconCursor'
import { IconHand } from '../../../../icons/IconHand'
import type { Tool } from '../store/State'
import { useStore } from '../store/store'
import { effectiveTool } from '../store/utils/tool'
import { ControlButton } from './ControlButton'
import { ControlGroup } from './ControlGroup'

const TOOLS: { tool: Tool; label: string; title: string; icon: ReactNode }[] = [
  {
    tool: 'select',
    label: 'Selection tool',
    title: 'Selection tool (V)',
    icon: <IconCursor />,
  },
  {
    tool: 'hand',
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
      {TOOLS.map(({ tool, label, title, icon }) => (
        <ControlButton
          key={tool}
          title={title}
          aria-label={label}
          active={active === tool}
          onClick={() => setTool(tool)}
          className="px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            {icon}
          </span>
        </ControlButton>
      ))}
    </ControlGroup>
  )
}
