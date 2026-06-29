import * as PopoverPrimitive from '@radix-ui/react-popover'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { ProjectVersionSwitcher as ProjectVersionSwitcherData } from '~/utils/project/projectVersions'
import { Popover, PopoverContent } from '../core/Popover'

/**
 * Renders the current version's label as an inline, underlined dropdown trigger
 * within the project title. Opening it lists every version in the group as a
 * link to its page. See {@link ProjectVersionSwitcherData} and
 * `~/utils/project/projectVersions` for how versions are linked together.
 */
export function ProjectVersionSwitcher({
  versions,
}: {
  versions: ProjectVersionSwitcherData
}) {
  return (
    <Popover>
      <PopoverPrimitive.Trigger
        className={cn(
          'group inline-flex items-center gap-1 underline decoration-2 underline-offset-4',
          'outline-none focus-visible:ring-2 focus-visible:ring-brand',
        )}
      >
        {versions.current}
        <ChevronIcon className="size-3 transition-transform group-data-[state=open]:rotate-180" />
      </PopoverPrimitive.Trigger>
      <PopoverContent
        align="start"
        className="flex min-w-32 flex-col gap-0.5 p-1"
      >
        {versions.options.map((option) => (
          <a
            key={option.href}
            href={option.selected ? undefined : option.href}
            aria-current={option.selected ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-1.5 font-medium text-label-value-15 leading-none',
              option.selected
                ? 'cursor-default bg-surface-secondary primary-card:bg-surface-tertiary text-primary'
                : 'text-secondary hover:bg-surface-secondary primary-card:hover:bg-surface-tertiary hover:text-primary',
            )}
          >
            {option.label}
          </a>
        ))}
      </PopoverContent>
    </Popover>
  )
}
