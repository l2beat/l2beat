import { existsSync } from 'fs'
import path from 'path'
import { ps } from '~/server/projects'
import { getOpengraphProjectTypes } from './projects/generateProjectOgImages'

// TODO: Uncomment this when we start using rewrite on production
// eslint-disable-next-line mocha/no-skipped-tests
describe.skip('opengraph images', () => {
  it('should contain project page opengraph images for all projects', async () => {
    const projects = await ps.getProjects({
      optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
    })

    const missingProjects = projects
      .filter((p) => {
        const types = getOpengraphProjectTypes(p)
        if (!types) {
          return false
        }
        return types
          .map((type) =>
            path.join(
              __dirname,
              `../../static/meta-images/${type}/projects/${p.slug}/opengraph-image.png`,
            ),
          )
          .some((p) => !existsSync(p))
      })
      .map((p) => p.slug)

    if (missingProjects.length > 0) {
      throw new Error(
        `Missing opengraph images for projects: ${missingProjects.join(', ')}. Run \`pnpm rewrite:generate-og-images\` to generate them.`,
      )
    }
  })
})
