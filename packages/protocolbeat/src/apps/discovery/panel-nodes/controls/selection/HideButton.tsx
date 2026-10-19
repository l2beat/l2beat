import { IconEyeClosed } from '../../../../../icons/IconEyeClosed'
import { useStore } from '../../store/store'
import { ToolbarButton } from '../ToolbarButton'

export function HideButton() {
  const selectionExists = useStore((state) => state.selected.length > 0)
  const hideSelected = useStore((state) => state.hideSelected)

  return (
    <ToolbarButton
      label="Hide"
      shortcut={['Del']}
      disabled={!selectionExists}
      onClick={hideSelected}
    >
      <IconEyeClosed />
    </ToolbarButton>
  )
}
