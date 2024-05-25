import { pluralize } from '@l2beat/shared-pure'
import { CriticalIcon } from '~/app/assets/CriticalIcon'
import { WarningIcon } from '~/app/assets/WarningIcon'

interface WarningProps {
  count: number
}

export function CriticalWarning(props: WarningProps) {
  return (
    <div className="flex items-center gap-1 text-red-700 font-semibold text-sm">
      <CriticalIcon />
      <span>{`${props.count} ${pluralize(props.count, 'critical')}`}</span>
    </div>
  )
}

export function Warning(props: WarningProps) {
  return (
    <div className="flex items-center gap-1">
      <WarningIcon />
      <span>{`${props.count} ${pluralize(props.count, 'warning')}`}</span>
    </div>
  )
}
