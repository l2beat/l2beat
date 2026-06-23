import { IconGroup } from '../../../../icons/IconGroup'
import { IconUngroup } from '../../../../icons/IconUngroup'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'
import { ControlGroup } from './ControlGroup'

const MIN_NODES = 2

export function GroupControls() {
  const selectedCount = useStore((state) => state.selected.length)
  const groupSelected = useStore((state) => state.groupSelected)
  const ungroupSelected = useStore((state) => state.ungroupSelected)

  if (selectedCount < MIN_NODES) {
    return null
  }

  const buttons = [
    {
      title: 'Group',
      icon: <IconGroup />,
      onClick: () => groupSelected(),
    },
    {
      title: 'Ungroup',
      icon: <IconUngroup />,
      onClick: () => ungroupSelected(),
    },
  ]

  return (
    <ControlGroup>
      {buttons.map((button) => (
        <ControlButton
          key={button.title}
          title={button.title}
          aria-label={button.title}
          onClick={button.onClick}
          className="px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            {button.icon}
          </span>
        </ControlButton>
      ))}
    </ControlGroup>
  )
}
