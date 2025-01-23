'use client'

import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { cn } from '~/utils/cn'
import { Switch } from '../core/switch'

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
