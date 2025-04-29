import { existsSync } from 'fs'
import path from 'path'
import type { Project } from '@l2beat/config'
import { expect } from 'earl'
import { ps } from '~/server/projects'

describe('opengraph images', () => {
  it('should contain opengraph images for all projects', async () => {
    const projects = await ps.getProjects({
      optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
    })
    const paths = projects.map(getFilePath).filter((p) => p !== undefined)
    const missing = paths.filter((p) => !existsSync(p))

    expect(missing).toEqual([])
  })
})

function getFilePath(
  project: Project<
    never,
    'isScaling' | 'isBridge' | 'isZkCatalog' | 'isDaLayer'
  >,
) {
  const type = project.isScaling
    ? 'scaling'
    : project.isBridge
      ? 'bridge'
      : project.isZkCatalog
        ? 'zk-catalog'
        : project.isDaLayer
          ? 'da-layer'
          : undefined
  if (!type) {
    return undefined
  }

  return path.join(
    __dirname,
    `../../static/meta-images/projects/${type}/${project.slug}.png`,
  )
}
