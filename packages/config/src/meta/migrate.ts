import { writeFileSync } from 'fs'
import { getProjects } from '../processing/getProjects'
import type { BaseProject } from '../types'
import type { Project } from './schema'

const IGNORED = ['payy-zk-catalog', 'near-da']

const projects = getProjects()
for (const project of projects) {
  if (IGNORED.includes(project.id)) {
    continue
  }

  writeFileSync(
    `src/projects/${project.id}/project.json`,
    JSON.stringify(toSchema(project), null, 2) + '\n',
  )
}

function toSchema(project: BaseProject): Project {
  if (!project.display) {
    throw new Error(`Missing display: ${project.id}`)
  }

  return {
    $schema: '../project.schema.json',
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    addedAt: new Date(project.addedAt * 1000).toISOString().slice(0, 10),
    display: {
      description: project.display.description,
      links: project.display.links,
      badges: project.display.badges.map((x) => `${x.type}.${x.id}`),
    },
  }
}
