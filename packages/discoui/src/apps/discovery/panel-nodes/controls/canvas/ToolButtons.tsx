import type { ReactNode } from 'react'
import { IconCursor } from '../../../../../icons/IconCursor'
import { IconHand } from '../../../../../icons/IconHand'
import type { CommandId } from '../../../keybindings/commands'
import { useCommandShortcut } from '../../../keybindings/useCommandShortcut'
import type { Tool } from '../../store/State'
import { useStore } from '../../store/store'
import { effectiveTool } from '../../store/utils/tool'
import { ToolbarButton } from '../ToolbarButton'

const TOOLS: {
  tool: Tool
  command: CommandId
  label: string
  icon: ReactNode
}[] = [
  {
    tool: 'select',
    command: 'tool.select',
    label: 'Selection tool',
    icon: <IconCursor />,
  },
  {
    tool: 'hand',
    command: 'tool.hand',
    label: 'Hand tool',
    icon: <IconHand />,
  },
]

export function ToolButtons() {
  return TOOLS.map((tool) => <ToolButton key={tool.tool} {...tool} />)
}

function ToolButton(props: (typeof TOOLS)[number]) {
  // Holding space borrows the hand tool, so highlight it while the key is down.
  const active = useStore(effectiveTool)
  const setTool = useStore((state) => state.setTool)
  const shortcut = useCommandShortcut(props.command)
  const holdShortcut = useCommandShortcut('tool.handHold')
  const description =
    props.tool === 'hand' ? handToolDescription(holdShortcut) : undefined

  return (
    <ToolbarButton
      label={props.label}
      description={description}
      shortcut={shortcut}
      active={active === props.tool}
      onClick={() => setTool(props.tool)}
    >
      {props.icon}
    </ToolbarButton>
  )
}

function handToolDescription(holdShortcut: string[] | undefined): string {
  if (holdShortcut === undefined) {
    return 'Drag to move the view. Middle mouse drag also pans.'
  }
  return `Drag to move the view. ${holdShortcut.join('+')} + drag or middle mouse drag also pans.`
}
