import { useCommandShortcut } from '../../../keybindings/useCommandShortcut'
import { useStore } from '../../store/store'
import { IconControlEyeOff } from '../icons/IconControlEyeOff'
import { ToolbarButton } from '../ToolbarButton'

export function HideButton() {
  const hideSelected = useStore((state) => state.hideSelected)
  const shortcut = useCommandShortcut('nodes.hideSelected')

  return (
    <ToolbarButton label="Hide" shortcut={shortcut} onClick={hideSelected}>
      <IconControlEyeOff />
    </ToolbarButton>
  )
}
