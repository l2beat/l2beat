import { ChevronIcon } from '~/icons/Chevron'
import type {
  ProjectVersionLink,
  ProjectVersionLinks,
} from '~/server/features/projects/getProjectVersionLinks'
import { cn } from '~/utils/cn'
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '../core/Popover'

export function ProjectVersionSwitcher({
  versions,
}: {
  versions: ProjectVersionLinks
}) {
  const current = versions.versions.find((v) => v.isCurrent)
  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Version ${current?.label}, switch version`}
        className="h-7 gap-1 rounded-md border border-divider px-2 font-bold text-label-value-15 hover:bg-surface-secondary md:text-label-value-15"
      >
        {current?.label}
        <ChevronIcon className="size-2.5 fill-current transition-transform group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      {/* Outside the h1, so the list is not part of the heading */}
      <PopoverPortal>
        <PopoverContent
          aria-label="Versions"
          align="start"
          className="flex min-w-48 flex-col p-1"
        >
          {versions.versions.map((version) => (
            <a
              key={version.href}
              href={version.href}
              aria-current={version.isCurrent ? 'page' : undefined}
              className={cn(
                'flex items-center justify-between gap-4 rounded px-2 py-1.5 text-label-value-14 hover:bg-surface-secondary',
                version.isCurrent && 'bg-surface-secondary font-bold',
              )}
            >
              {version.name}
              <VersionTag version={version} />
            </a>
          ))}
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}

function VersionTag({ version }: { version: ProjectVersionLink }) {
  if (!version.isLatest && !version.isArchived) return null
  return (
    <span
      className={cn(
        'font-medium text-2xs uppercase leading-none',
        version.isLatest ? 'text-positive' : 'text-secondary',
      )}
    >
      {version.isLatest ? 'Latest' : 'Archived'}
    </span>
  )
}
