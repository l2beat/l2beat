import { createContext, useContext } from 'react'
import type { BadgeWithParams } from './ProjectBadge'

/**
 * What a table entry carries instead of the badge itself. Hundreds of rows
 * share a few dozen badges, so the badge goes once per page into a
 * `BadgeLookup` and rows point at it by id. `href` is set only where the link
 * depends on the project, e.g. a badge that filters by the project's own name.
 */
export interface BadgeRef {
  id: string
  href?: string
}

export type BadgeLookup = Record<string, BadgeWithParams>

const BadgeLookupContext = createContext<BadgeLookup>({})

export function BadgeLookupProvider({
  lookup,
  children,
}: {
  lookup: BadgeLookup
  children: React.ReactNode
}) {
  return (
    <BadgeLookupContext.Provider value={lookup}>
      {children}
    </BadgeLookupContext.Provider>
  )
}

export function useBadges(refs: BadgeRef[] | undefined): BadgeWithParams[] {
  const lookup = useContext(BadgeLookupContext)
  return resolveBadgeRefs(refs, lookup)
}

export function resolveBadgeRefs(
  refs: BadgeRef[] | undefined,
  lookup: BadgeLookup,
): BadgeWithParams[] {
  if (!refs) return []
  return refs.map((ref) => {
    const badge = lookup[ref.id]
    // Throwing fails the server render, so a page that shows badge rows
    // without a provider breaks the all-pages e2e instead of losing badges.
    if (!badge)
      throw new Error('Badge missing from the page lookup', { cause: ref })
    return { ...badge, href: ref.href ?? badge.href }
  })
}
