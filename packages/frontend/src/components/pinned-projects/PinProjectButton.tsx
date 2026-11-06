import { useEffect, useMemo, useState } from 'react'
import { usePathname } from '~/hooks/usePathname'
import { PinIcon } from '~/icons/Pin'
import { cn } from '~/utils/cn'
import { type SavedProject, usePinnedState } from './pinnedProjectsStore'
import { recordVisit, withPinTransition } from './withPinTransition'

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
  // Pinned with a pointer, the pin drives in as the row flies to the nav.
  const [driving, setDriving] = useState(false)

  useEffect(() => {
    recordVisit(project)
  }, [project])

  return (
    <button
      type="button"
      onClick={(event) => {
        // From the keyboard it just changes.
        if (event.detail === 0) {
          toggle()
          return
        }
        setDriving(!isPinned)
        withPinTransition(toggle)
      }}
      aria-pressed={isPinned}
      className={cn(
        'flex h-6 items-center justify-center gap-1.5 rounded border px-2 font-medium text-2xs uppercase leading-none transition-colors',
        isPinned
          ? 'border-brand text-brand-deep'
          : 'border-divider text-secondary hover:text-primary',
        className,
      )}
    >
      <PinIcon
        aria-hidden
        className={cn(
          'size-3',
          isPinned && 'fill-current',
          driving && 'pin-drive',
        )}
        onAnimationEnd={() => setDriving(false)}
      />
      {isPinned ? 'Pinned' : 'Pin'}
    </button>
  )
}
