import type { ProjectScalingScopeOfAssessment } from '@l2beat/config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/collapsible'
import { Markdown } from '~/components/markdown/markdown'
import { ChevronIcon } from '~/icons/chevron'
import { MissingIcon } from '~/icons/missing'
import { SatisfiedIcon } from '~/icons/satisfied'
import { cn } from '~/utils/cn'

export function ScopeOfAssessment({
  scopeOfAssessment,
  className,
}: {
  scopeOfAssessment: ProjectScalingScopeOfAssessment
  className?: string
}) {
  return (
    <Collapsible
      className={cn('group rounded-lg border border-divider', className)}
      defaultOpen
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 font-bold md:px-6">
        Scope of assessment
        <ChevronIcon className="size-4 transition-transform duration-300 group-data-[state=open]:-rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-4 pb-6 md:px-6">
        {scopeOfAssessment.checked && (
          <Section checked items={scopeOfAssessment.checked} />
        )}
        {scopeOfAssessment.notChecked && (
          <Section checked={false} items={scopeOfAssessment.notChecked} />
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function Section({
  checked,
  items,
}: {
  checked: boolean
  items: string[]
}) {
  const Icon = checked ? SatisfiedIcon : MissingIcon
  return (
    <div className="flex flex-col gap-2">
      <span
        className={cn(
          'text-xs font-medium',
          checked ? 'text-positive' : 'text-negative',
        )}
      >
        {checked ? 'Things we checked' : 'Things we did not check'}
      </span>
      <div
        className={cn(
          'flex flex-col gap-1 rounded-lg border px-[15px] py-3',
          checked ? 'border-positive' : 'border-negative',
        )}
      >
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <Icon
              className={cn(
                'mt-[5px] size-4 shrink-0',
                checked ? 'fill-positive' : 'fill-negative',
              )}
            />
            <Markdown className="text-base font-bold leading-[170%] text-primary">
              {item}
            </Markdown>
          </div>
        ))}
      </div>
    </div>
  )
}
