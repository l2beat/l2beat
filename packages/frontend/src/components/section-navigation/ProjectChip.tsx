import { useEffect, useState } from 'react'
import { cn } from '~/utils/cn'

export interface ProjectChipProps {
  project: { name: string; icon: string }
}

// The sticky bar is h-10 and covers the top of the viewport, so a header
// behind it is already out of view.
const STICKY_BAR_HEIGHT = 40

/**
 * Shows the project's logo in the sticky bar, so a screenshot of any section
 * shows whose page it is. Hidden while the page's own header is on screen,
 * where it would only repeat it.
 *
 * The slot animates an exact width, not a max-width, so it opens in step with
 * the logo growing into it rather than snapping open and leaving a gap.
 */
export function ProjectChip({ project }: ProjectChipProps) {
  const isRevealed = useIsProjectHeaderScrolledPast()

  return (
    <button
      type="button"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      inert={!isRevealed}
      className={cn(
        'relative flex h-10 shrink-0 items-center justify-center overflow-hidden border-divider border-b bg-header-primary transition-[width] after:absolute after:inset-y-2.5 after:right-0 after:w-px after:bg-divider motion-reduce:transition-none',
        isRevealed
          ? 'w-11 duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]'
          : 'w-0 duration-150 ease-out',
      )}
    >
      <img
        src={project.icon}
        width={20}
        height={20}
        alt={project.name}
        className={cn(
          'size-5 shrink-0 rounded-full transition-[scale,opacity] motion-reduce:scale-100',
          isRevealed
            ? 'scale-100 opacity-100 duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]'
            : 'scale-75 opacity-0 duration-100 ease-out',
        )}
      />
    </button>
  )
}

/**
 * Observes the header rather than a scroll offset, because header heights
 * differ between page types.
 */
function useIsProjectHeaderScrolledPast() {
  const [isScrolledPast, setIsScrolledPast] = useState(false)

  useEffect(() => {
    const header = document.querySelector('[data-role="project-header"]')
    if (!header) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolledPast(!entry?.isIntersecting),
      { rootMargin: `-${STICKY_BAR_HEIGHT}px 0px 0px 0px` },
    )
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return isScrolledPast
}
