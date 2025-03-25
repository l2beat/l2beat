import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Bridge, ScalingProject } from '../internalTypes'
import { Project } from '../meta/schema'
import type { BaseProject } from '../types'
import { bridges } from './bridges'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'
import { projectFromSchema } from './projectFromSchema'
import { refactored } from './refactored'

export function getJsonProjects(): BaseProject[] {
  const schemas = getSchemas()
  const schemaIds = new Set(schemas.map((s) => s.id))

  const refactoredSchemas = refactored.map(refactoredToSchema)
  const legacySchemas = [...layer2s, ...layer3s, ...bridges].map(legacyToSchema)

  const allProjects: Project[] = [...refactoredSchemas, ...legacySchemas]
    .filter((p) => !schemaIds.has(p.id))
    .concat(schemas)

  return schemas.map((s) => projectFromSchema(s, allProjects))
}

function getSchemas(): Project[] {
  const dir = readdirSync('src/projects')
  const projects: Project[] = []
  for (const item of dir) {
    const file = join('src/projects', item, 'project.json')
    if (existsSync(file)) {
      const contents = readFileSync(file, 'utf-8')
      projects.push(Project.parse(JSON.parse(contents)))

      console.warn(`${item}: read project from json`)
    }
  }
  if (projects.length > 0) {
    console.warn(
      '!!!\n' +
        'Some projects were read from json. This is experimental and should not happen in production.\n' +
        'To remove those projects run: rm **/project.json\n' +
        '!!!',
    )
  }
  return projects
}

function refactoredToSchema(p: BaseProject): Project {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortName: p.shortName,
    addedAt: '',
    display: { description: '', links: {} },
  }
}

function legacyToSchema(p: ScalingProject | Bridge): Project {
  return {
    id: p.id,
    slug: p.display.slug,
    name: p.display.name,
    shortName: p.display.shortName,
    addedAt: '',
    display: { description: '', links: {} },
  }
}
