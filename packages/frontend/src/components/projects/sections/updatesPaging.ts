import type { ProjectDiscoveryUpdate } from '@l2beat/config'

// Shared by the server prefetch and the section component. Kept out of the
// .tsx so the dev server bundle never pulls in React components.
export const UPDATES_PAGE_SIZE = 5

/** Everything but the diff bodies, which are loaded per page via
 *  `projects.discoveryUpdateSections`. */
export type ProjectDiscoveryUpdateSummary = Omit<
  ProjectDiscoveryUpdate,
  'sections'
>
