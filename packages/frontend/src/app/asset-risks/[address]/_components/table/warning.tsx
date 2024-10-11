import { pluralize } from '@l2beat/shared-pure'
import { CriticalBadgeIcon } from '../../_assets/critical-badge'
import { WarningBadgeIcon } from '../../_assets/warning-badge'

interface WarningProps {
  count: number
}

export function CriticalWarning(props: WarningProps) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium text-red-700">
      <CriticalBadgeIcon />
      <span>{`${props.count} ${pluralize(props.count, 'critical')}`}</span>
    </div>
  )
}

export function Warning(props: WarningProps) {
  return (
    <div className="flex items-center gap-1">
      <WarningBadgeIcon />
      <span>{`${props.count} ${pluralize(props.count, 'warning')}`}</span>
    </div>
  )
}
