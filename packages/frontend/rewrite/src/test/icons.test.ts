import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { ProjectService } from '@l2beat/config'
import { expect } from 'earl'
import { getImageDimensions } from '~/utils/project/get-image-params'

// TODO: Uncomment this when we start using rewrite on production
// eslint-disable-next-line mocha/no-skipped-tests
describe.skip('icons', () => {
  const ps = new ProjectService()

  describe('projects', () => {
    it('every project has an icon', async () => {
      const icons = getIcons('../../static/icons')
      const projects = await ps.getProjects({
        // We handle ecosystem logos in a different way
        whereNot: ['ecosystemConfig'],
      })
      console.log(icons)

      const uniqueSlugs = projects
        .map((x) => x.slug)
        .filter((x, i, a) => a.indexOf(x) === i) // unique
        .sort()
      const requiredIcons = icons.filter((x) => uniqueSlugs.includes(x))

      expect(requiredIcons).toEqual(uniqueSlugs)
    })
  })

  describe('raas', () => {
    it('every raas has an icon', async () => {
      const icons = getIcons('../../static/icons')
      const projects = await ps.getProjects({
        select: ['display'],
      })

      const raasSlugs = projects
        .flatMap((x) => {
          const badgeName = x.display?.badges
            .find((b) => b.type === 'RaaS')
            ?.name.toLowerCase()
          if (!badgeName) return []
          return [badgeName]
        })
        .filter((x, i, a) => a.indexOf(x) === i) // unique
      for (const slug of raasSlugs) {
        expect(icons).toInclude(slug)
      }
    })
  })

  describe('ecosystems', () => {
    it('every ecosystem has an icon', async () => {
      const ecosystems = await ps.getProjects({
        where: ['ecosystemConfig'],
      })
      for (const ecosystem of ecosystems) {
        const icons = getIcons(`../../static/ecosystems/${ecosystem.slug}`)
        expect(icons).toInclude('logo')
      }
    })

    it('has the same dimensions between light and dark', async () => {
      const ecosystems = await ps.getProjects({
        where: ['ecosystemConfig'],
      })
      for (const ecosystem of ecosystems) {
        const icons = getIcons(`../../static/ecosystems/${ecosystem.slug}`)
        const hasDarkIcon = !!icons.find((i) => i.endsWith('.dark'))
        if (!hasDarkIcon) {
          continue
        }
        const lightIconBuffer = readFileSync(
          path.join(
            __dirname,
            `../../static/ecosystems/${ecosystem.slug}/logo.png`,
          ),
        )
        const darkIconBuffer = readFileSync(
          path.join(
            __dirname,
            `../../static/ecosystems/${ecosystem.slug}/logo.dark.png`,
          ),
        )
        const lightIconDimensions = getImageDimensions(lightIconBuffer)
        const darkIconDimensions = getImageDimensions(darkIconBuffer)
        expect(lightIconDimensions?.height).toEqual(darkIconDimensions?.height)
        expect(lightIconDimensions?.width).toEqual(darkIconDimensions?.width)
      }
    })
  })
})

function getIcons(dir: string) {
  const icons = readdirSync(path.join(__dirname, dir), {
    withFileTypes: true,
  })
    .filter((x) => x.isFile() && x.name.endsWith('.png'))
    .map((x) => x.name.slice(0, -4))
    .sort()
  return icons
}
