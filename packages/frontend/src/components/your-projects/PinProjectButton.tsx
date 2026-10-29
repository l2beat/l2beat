import { useEffect, useMemo } from 'react'
import { usePathname } from '~/hooks/usePathname'
import { PinIcon } from '~/icons/Pin'
import { cn } from '~/utils/cn'
import {
  recordProjectVisit,
  type SavedProject,
  usePinnedState,
} from './yourProjectsStore'

/**
 * Pins the project to the nav's "Pinned" list. Opening the page also adds
 * the project to its "Recently viewed" list.
 */
export function PinProjectButton({
  name,
  iconUrl,
  href: canonicalHref,
  className,
}: {
  name: string
  iconUrl: string
  /** Keys the saved project; without it, the current path. */
  href?: string
  className?: string
}) {
  const pathname = usePathname()
  const href = canonicalHref ?? pathname
  const project = useMemo<SavedProject>(
    () => ({ href, name, iconUrl }),
    [href, name, iconUrl],
  )
  const { isPinned, toggle } = usePinnedState(project)

  useEffect(() => {
    recordProjectVisit(project)
  }, [project])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isPinned}
      className={cn(
        'flex h-6 items-center justify-center gap-1.5 rounded border px-2 font-medium text-2xs uppercase leading-none transition-colors',
        isPinned
          ? 'border-brand text-brand'
          : 'border-divider text-secondary hover:text-primary',
        className,
      )}
    >
      <PinIcon
        aria-hidden
        className={cn('size-3', isPinned && 'fill-current')}
      />
      {isPinned ? 'Pinned' : 'Pin'}
    </button>
  )
}
