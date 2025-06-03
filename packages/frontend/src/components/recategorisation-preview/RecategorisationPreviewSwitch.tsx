import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/RecategorisationPreviewProvider'
import { cn } from '~/utils/cn'
import { Switch } from '../core/Switch'

export function RecategorisationPreviewSwitch({
  className,
}: {
  className?: string
}) {
  const { checked, setChecked } = useRecategorisationPreviewContext()
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
