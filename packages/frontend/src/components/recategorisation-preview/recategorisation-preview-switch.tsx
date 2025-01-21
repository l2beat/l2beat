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
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-sm font-semibold">Preview Recategorisation</span>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => setChecked(!!checked)}
      />
    </div>
  )
}
