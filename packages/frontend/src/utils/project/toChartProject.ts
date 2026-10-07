import type { ProjectId } from '@l2beat/shared-pure'
import type { ChartProject } from '~/components/core/chart/Chart'
import { manifest } from '~/utils/Manifest'

// Chart sections only display the project's identity. Passing the whole
// project object serializes it into the page for every section, which for
// projects with long discovery histories adds megabytes of HTML per section.
export function toChartProject(project: {
  id: ProjectId
  slug: string
  name: string
  shortName: string | undefined
}): ChartProject {
  return {
    id: project.id,
    name: project.name,
    shortName: project.shortName,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
  }
}
