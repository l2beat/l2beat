import { IconEyeClosed } from '../../../../../icons/IconEyeClosed'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { useStore } from '../../store/store'
import { ToolbarButton } from '../ToolbarButton'

export function HideButton() {
  const hideSelected = useStore((state) => state.hideSelected)
  const { isMac } = useIsomorphicKeys()

  return (
    <ToolbarButton
      label="Hide"
      shortcut={[isMac ? 'Delete' : 'Del']}
      onClick={hideSelected}
    >
      <IconEyeClosed />
    </ToolbarButton>
  )
}
