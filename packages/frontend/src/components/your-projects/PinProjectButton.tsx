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
 * Pins the project to the nav's "Your projects". Opening the page also adds
 * the project to the nav's recent ones.
 */
export function PinProjectButton({
  name,
  iconUrl,
  className,
}: {
  name: string
  iconUrl: string
  className?: string
}) {
  const href = usePathname()
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
        'flex h-8 items-center justify-center gap-1.5 rounded border px-2.5 font-medium text-xs uppercase leading-none transition-colors',
        isPinned
          ? 'border-brand text-brand'
          : 'border-divider text-secondary hover:text-primary',
        className,
      )}
    >
      <PinIcon
        aria-hidden
        className={cn('size-3.5', isPinned && 'fill-current')}
      />
      {isPinned ? 'Pinned' : 'Pin'}
    </button>
  )
}
