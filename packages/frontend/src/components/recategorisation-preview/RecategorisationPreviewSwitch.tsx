import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/RecategorisationPreviewProvider'
import { cn } from '~/utils/cn'
import { Switch } from '../core/Switch'

export function RecategorisationPreviewSwitch({
  className,
}: {
  className?: string
}) {
  const { checked, setChecked } = useRecategorisationPreviewContext()

  if (PROJECT_COUNTDOWNS.otherMigration < UnixTime.now()) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-3 font-semibold', className)}>
      <span className="text-sm">Preview Recategorisation</span>
      <Switch
        name="recategorisationPreview"
        checked={checked}
        onCheckedChange={(checked) => setChecked(!!checked)}
      />
    </div>
  )
}
