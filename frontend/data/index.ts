import l2Data from '@l2beat/backend'
import { projects } from '@l2beat/config'

export { dataPipeline as dataPipelineConfig } from '@l2beat/config'
export { l2Data }

export const projectsMetaData = Object.fromEntries(projects.map((p) => [p.name, p.details]))
