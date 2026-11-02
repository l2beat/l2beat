import type {
  PinnedProjects,
  SavedProject,
} from '../pinned-projects/pinnedProjectsStore'

// The list is 270px tall on desktop, about six rows. Capping each group keeps
// all three in reach without a long scroll.
const MAX_PINNED = 5
const MAX_RECENTLY_VIEWED = 3
/** Only when the visitor's own groups are shown; otherwise all are. */
const MAX_RECENTLY_ADDED_WITH_OWN = 5

interface EmptyStateGroups<T extends { href: string }> {
  pinned: SavedProject[]
  recentlyViewed: SavedProject[]
  recentlyAdded: T[]
}

/**
 * What the dialog lists before anything is typed: the visitor's way back to
 * their projects first, then what's new. A project appears once, in the
 * first group that has it. The page being viewed is left out of Recently
 * viewed: opening it records a visit, so it would always take the first slot.
 */
export function getEmptyStateGroups<T extends { href: string }>(
  { pinned, recent }: Pick<PinnedProjects, 'pinned' | 'recent'>,
  recentlyAdded: T[],
  currentHref: string,
): EmptyStateGroups<T> {
  const shown = new Set<string>()
  const takeUnshown = <P extends { href: string }>(
    projects: P[],
    max: number,
  ) => {
    const taken = projects.filter((p) => !shown.has(p.href)).slice(0, max)
    for (const p of taken) shown.add(p.href)
    return taken
  }

  const pinnedGroup = takeUnshown(pinned, MAX_PINNED)
  const recentlyViewed = takeUnshown(
    recent.filter((p) => p.href !== currentHref),
    MAX_RECENTLY_VIEWED,
  )
  const hasOwn = pinnedGroup.length > 0 || recentlyViewed.length > 0
  return {
    pinned: pinnedGroup,
    recentlyViewed,
    recentlyAdded: takeUnshown(
      recentlyAdded,
      hasOwn ? MAX_RECENTLY_ADDED_WITH_OWN : recentlyAdded.length,
    ),
  }
}
