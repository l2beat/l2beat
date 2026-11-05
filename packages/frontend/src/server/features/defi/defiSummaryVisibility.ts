import type { ProjectDefiCategory } from '@l2beat/config'
import {
  DEFI_LIQUID_STAKING_SUMMARY_DESCRIPTION,
  DEFI_SUMMARY_DESCRIPTION,
} from '~/consts/summaryPageDescriptions'

/**
 * TEMPORARY: for now the DeFi summary page shows liquid staking protocols
 * only. Projects in every other category are hidden from the summary, not
 * deleted: their configs and their project pages are untouched.
 *
 * To list every DeFi project again set this to `undefined`. The summary then
 * gets its "Protocols" tab back, next to the liquid staking one, and is called
 * "DeFi" again.
 */
export const DEFI_SUMMARY_CATEGORIES:
  | readonly ProjectDefiCategory[]
  | undefined = ['Liquid Staking']

/**
 * What the summary is called in the navigation, the page header, the page
 * title and the search bar: not "DeFi" while it shows liquid staking only.
 */
export const DEFI_SUMMARY_TITLE =
  DEFI_SUMMARY_CATEGORIES === undefined ? 'DeFi' : 'Liquid Staking'

/** The intro of the summary page, repeated by its metadata and markdown version. */
export const DEFI_SUMMARY_PAGE_DESCRIPTION =
  DEFI_SUMMARY_CATEGORIES === undefined
    ? DEFI_SUMMARY_DESCRIPTION
    : DEFI_LIQUID_STAKING_SUMMARY_DESCRIPTION

export function filterDefiSummaryProjects<
  T extends { defiInfo: { category: ProjectDefiCategory } },
>(projects: T[], categories: readonly ProjectDefiCategory[] | undefined): T[] {
  if (categories === undefined) {
    return projects
  }
  return projects.filter((project) =>
    categories.includes(project.defiInfo.category),
  )
}
