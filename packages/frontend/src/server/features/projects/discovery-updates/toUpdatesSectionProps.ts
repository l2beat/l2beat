import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import {
  UPDATES_PAGE_SIZE,
  type UpdatesSectionProps,
} from '~/components/projects/sections/UpdatesSection'

// Diff bodies are the bulk of a project's update history and only the first
// page is rendered on load. Later pages fetch their bodies on demand, so
// shipping them all would inline megabytes of unused HTML into every page.
export function toUpdatesSectionProps(
  projectId: ProjectId,
  updates: ProjectDiscoveryUpdate[],
): Pick<UpdatesSectionProps, 'projectId' | 'updates'> {
  return {
    projectId,
    updates: updates.map((update, index) =>
      index < UPDATES_PAGE_SIZE ? update : withoutSections(update),
    ),
  }
}

function withoutSections({ sections: _, ...update }: ProjectDiscoveryUpdate) {
  return update
}
