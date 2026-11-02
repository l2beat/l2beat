import { expect } from 'earl'
import { getNavLinkHref } from './navLinkHref'
import type { NavLink } from './types'

// Method: a small group shaped like Layer 2s (category tabs, a page with its
// own tab ids, a filters-only page, a page with neither, and a sub-link),
// with the current URL given as pathname + search, as the hook passes them.
describe(getNavLinkHref.name, () => {
  const CATEGORY = { tabs: ['rollups', 'validiumsAndOptimiums'], filters: true }
  const summary: NavLink = {
    title: 'Summary',
    href: '/l2/summary',
    viewParams: CATEGORY,
  }
  const activity: NavLink = {
    title: 'Activity',
    href: '/l2/activity',
    viewParams: { filters: true },
  }
  const stateValidation: NavLink = {
    title: 'State Validation',
    href: '/l2/risk/state-validation',
    viewParams: { tabs: ['validity', 'optimistic'], filters: true },
  }
  const risk: NavLink = {
    title: 'Risk',
    href: '/l2/risk',
    viewParams: CATEGORY,
    subLinks: [stateValidation],
  }
  const compare: NavLink = { title: 'Compare', href: '/l2/compare' }
  const groupLinks = [summary, risk, activity, compare]

  const FILTERS = '{"stack":{"values":["OP Stack"]}}'
  const search = `?${new URLSearchParams({ tab: 'validiumsAndOptimiums', filters: FILTERS })}`

  function hrefFrom(pathname: string, search: string, target: NavLink) {
    return getNavLinkHref(target, { pathname, search, groupLinks })
  }

  function paramsOf(href: string) {
    return Object.fromEntries(new URLSearchParams(href.split('?')[1]))
  }

  it('carries tab and filters to a page with the same tabs', () => {
    const href = hrefFrom('/l2/summary', search, risk)

    expect(href.split('?')[0]).toEqual('/l2/risk')
    expect(paramsOf(href)).toEqual({
      tab: 'validiumsAndOptimiums',
      filters: FILTERS,
    })
  })

  it('drops a tab the target does not have but keeps filters', () => {
    expect(paramsOf(hrefFrom('/l2/summary', search, activity))).toEqual({
      filters: FILTERS,
    })
    expect(paramsOf(hrefFrom('/l2/summary', search, stateValidation))).toEqual({
      filters: FILTERS,
    })
  })

  it('finds the current page among sub-links', () => {
    const href = hrefFrom('/l2/risk/state-validation', '?tab=validity', summary)

    expect(href).toEqual('/l2/summary')
  })

  it('leaves a target without view params untouched', () => {
    expect(hrefFrom('/l2/summary', search, compare)).toEqual('/l2/compare')
  })

  it('carries nothing from a page outside the group, e.g. a project page', () => {
    expect(
      hrefFrom('/l2/projects/arbitrum/tvs-breakdown', search, summary),
    ).toEqual('/l2/summary')
  })

  it('carries nothing from a group page without view params', () => {
    expect(hrefFrom('/l2/compare', search, summary)).toEqual('/l2/summary')
  })

  it('keeps the bare href when the current URL has no view state', () => {
    expect(hrefFrom('/l2/summary', '', risk)).toEqual('/l2/risk')
    expect(hrefFrom('/l2/summary', '?sort=tvs', risk)).toEqual('/l2/risk')
  })
})
