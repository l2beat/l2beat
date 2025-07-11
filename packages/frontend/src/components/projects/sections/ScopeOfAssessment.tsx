import type { ProjectScalingScopeOfAssessment } from '@l2beat/config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { Markdown } from '~/components/markdown/Markdown'
import { ChevronIcon } from '~/icons/Chevron'
import { MissingIcon } from '~/icons/Missing'
import { SatisfiedIcon } from '~/icons/Satisfied'
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
        <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 transition-transform duration-300" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-4 pb-6 md:px-6">
        {scopeOfAssessment.inScope && (
          <Section checked items={scopeOfAssessment.inScope} />
        )}
        {scopeOfAssessment.notInScope && (
          <Section checked={false} items={scopeOfAssessment.notInScope} />
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function Section({ checked, items }: { checked: boolean; items: string[] }) {
  const Icon = checked ? SatisfiedIcon : MissingIcon
  return (
    <div className="flex flex-col gap-2">
      <span
        className={cn(
          'font-medium text-xs',
          checked ? 'text-positive' : 'text-negative',
        )}
      >
        {checked ? 'In scope' : 'Not in scope'}
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
            <Markdown className="font-bold text-base text-primary leading-[170%]">
              {item}
            </Markdown>
          </div>
        ))}
      </div>
    </div>
  )
}
