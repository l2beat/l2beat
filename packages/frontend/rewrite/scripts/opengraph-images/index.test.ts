import { existsSync } from 'fs'
import path from 'path'
import { expect } from 'earl'
import { ps } from '~/server/projects'
import { getOpengraphProjectTypes } from './projects/generateProjectOgImages'

describe('opengraph images', () => {
  it('should contain project page opengraph images for all projects', async () => {
    const projects = await ps.getProjects({
      optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
    })
    const missing = projects
      .flatMap((p) => {
        const types = getOpengraphProjectTypes(p)
        if (!types) {
          return []
        }
        return types.map((type) =>
          path.join(
            __dirname,
            `../../static/meta-images/${type}/projects/${p.slug}/opengraph-image.png`,
          ),
        )
      })
      .filter((p) => !existsSync(p))

    expect(missing).toEqual([])
  })
})
