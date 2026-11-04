import type { Project } from '@l2beat/config'
import { env } from '~/env'

/**
 * While DeFi pages are disabled, projects tracked by Ossification still get a
 * standalone page, so the Ossification table can link to them without
 * exposing the rest of DeFi.
 */
export function hasDefiProjectPage(project: {
  ossificationHistory?: Project<'ossificationHistory'>['ossificationHistory']
}): boolean {
  return (
    env.CLIENT_SIDE_DEFI_ENABLED ||
    (env.CLIENT_SIDE_OSSIFICATION_ENABLED &&
      project.ossificationHistory !== undefined)
  )
}
