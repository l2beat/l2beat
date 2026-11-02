import { useLocationSearch } from '~/hooks/useLocationSearch'
import { usePathname } from '~/hooks/usePathname'
import type { NavLink } from './types'

/** The view state a nav link's page reads from its URL. */
export interface NavViewParams {
  /** The `?tab=` ids its DirectoryTabs has. */
  tabs?: readonly string[]
  /** Whether it reads `?filters=`, i.e. has a TableFilterContextProvider. */
  filters?: boolean
}

/**
 * Builds a nav link's href, giving it the current page's tab and filters
 * when both pages are in the same nav group and the target has them, so a
 * visitor comparing one filtered set across metrics need not rebuild it on
 * every page.
 *
 * The current page must itself be one of the group's links: a project page
 * under /layer2s keeps its own `?filters=` (e.g. on token breakdowns) whose
 * ids mean nothing on the group's tables.
 */
export function getNavLinkHref(
  target: NavLink,
  current: { pathname: string; search: string; groupLinks: NavLink[] },
): string {
  const source = findPageLink(current.groupLinks, current.pathname)
  const sourceParams = source?.viewParams
  const targetParams = target.viewParams
  if (!sourceParams || !targetParams) return target.href

  const currentParams = new URLSearchParams(current.search)
  const [path, query] = target.href.split('?')
  const params = new URLSearchParams(query)

  const tab = currentParams.get('tab')
  if (
    tab &&
    sourceParams.tabs?.includes(tab) &&
    targetParams.tabs?.includes(tab)
  ) {
    params.set('tab', tab)
  }

  const filters = currentParams.get('filters')
  if (filters && sourceParams.filters && targetParams.filters) {
    params.set('filters', filters)
  }

  return params.size > 0 ? `${path}?${params}` : target.href
}

/** Hrefs that follow the current URL, including client-side tab and filter changes. */
export function useNavLinkHref(groupLinks: NavLink[]) {
  const pathname = usePathname()
  const search = useLocationSearch()
  return (target: NavLink) =>
    getNavLinkHref(target, { pathname, search, groupLinks })
}

function findPageLink(links: NavLink[], pathname: string): NavLink | undefined {
  for (const link of links) {
    if (link.href.split('?')[0] === pathname) return link
    const subLink = link.subLinks && findPageLink(link.subLinks, pathname)
    if (subLink) return subLink
  }
}
