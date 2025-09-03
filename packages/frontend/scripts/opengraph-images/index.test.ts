import { existsSync } from 'fs'
import path from 'path'
import { getCollection } from '~/content/getCollection'
import { ps } from '~/server/projects'
import { getOpengraphProjectTypes } from './projects/generateProjectOgImages'

describe('opengraph images', () => {
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
        `Missing opengraph images for projects: ${missingProjects.join(', ')}. Run \`pnpm og-images\` to generate them.`,
      )
    }
  })

  it('should contain governance articles opengraph images', async () => {
    const articles = getCollection('governance-publications')

    const missingArticles = articles
      .filter((p) => {
        const imageExists = path.join(
          __dirname,
          `../../static/meta-images/publications/${p.id}.png`,
        )
        return !existsSync(imageExists)
      })
      .map((p) => p.id)

    if (missingArticles.length > 0) {
      throw new Error(
        `Missing opengraph images for governance articles: ${missingArticles.join(', ')}. Please add them.`,
      )
    }
  })

  it('should contain monthly updates opengraph images', async () => {
    const articles = getCollection('monthly-updates')

    const missingUpdates = articles
      .filter((p) => {
        const imageExists = path.join(
          __dirname,
          `../../static/meta-images/publications/${p.id}.png`,
        )
        return !existsSync(imageExists)
      })
      .map((p) => p.id)

    if (missingUpdates.length > 0) {
      throw new Error(
        `Missing opengraph images for monthly updates: ${missingUpdates.join(', ')}. Please add them.`,
      )
    }
  })
})
