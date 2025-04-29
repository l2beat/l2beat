import { existsSync } from 'fs'
import path from 'path'
import type { Project } from '@l2beat/config'
import { expect } from 'earl'
import { ps } from '~/server/projects'
import { getOpengraphProjectType } from './projects/generateProjectOgImages'

describe('opengraph images', () => {
  it('should contain opengraph images for all projects', async () => {
    const projects = await ps.getProjects({
      optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
    })
    const missing = projects
      .map(getFilePath)
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
    `../../static/meta-images/projects/${type}/${project.slug}.png`,
  )
}
