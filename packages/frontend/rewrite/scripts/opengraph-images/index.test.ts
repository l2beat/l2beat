import { existsSync } from 'fs'
import path from 'path'
import type { Project } from '@l2beat/config'
import { expect } from 'earl'
import { ps } from '~/server/projects'
import { getOpengraphProjectType } from './projects/generateProjectOgImages'

describe('opengraph images', () => {
  it('should contain project page opengraph images for all projects', async () => {
    const projects = await ps.getProjects({
      optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
    })
    const missing = projects
      .map(getFilePath)
      .filter((p) => p !== undefined && !existsSync(p))

    expect(missing).toEqual([])
  })

  it('should contain tvs breakdown opengraph images for all scaling projects', async () => {
    const projects = await ps.getProjects({
      where: ['isScaling'],
    })
    const missing = projects
      .map((p) =>
        path.join(
          __dirname,
          `../../static/meta-images/scaling/projects/${p.slug}/opengraph-image.png`,
        ),
      )
      .filter((p) => p !== undefined && !existsSync(p))

    expect(missing).toEqual([])
  })
})

function getFilePath(
  project: Project<
    never,
    'isScaling' | 'isBridge' | 'isZkCatalog' | 'isDaLayer'
  >,
) {
  const type = getOpengraphProjectType(project)
  if (!type) {
    return undefined
  }

  return path.join(
    __dirname,
    `../../static/meta-images/${type}/projects/${project.slug}/opengraph-image.png`,
  )
}
