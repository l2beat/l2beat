import { expect } from 'earl'
import { daLayers } from '.'
import type { ProjectLinks } from '../../types'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'

describe('DA-BEAT', () => {
  daLayers.forEach((project) => {
    describe(project.display.name, () => {
      it('should contain description with dot at the end', () => {
        expect(project.display.description.endsWith('.')).toEqual(true)
      })

      project.daLayer.bridges.forEach((bridge) => {
        describe(bridge.display.name, () => {
          it(`should contain bridge description with dot at the end`, () => {
            expect(bridge.display.description.endsWith('.')).toEqual(true)
          })
        })
      })
    })

    describe(`${project.display.name} does not have duplicated links`, () => {
      const getFlatLinks = (links: ProjectLinks | undefined) => {
        const values: (string | string[] | undefined)[] = Object.values(
          links ?? {},
        )
        return values.filter((x) => x !== undefined).flatMap((link) => link)
      }

      const links = getFlatLinks(project.display?.links)
      const uniqueLinks = new Set(links)

      for (const bridge of project.daLayer.bridges) {
        it(`should not have duplicated links with ${bridge.display.name}`, () => {
          const hasUniqueLinks = getFlatLinks(bridge.display.links).every(
            (link) => !uniqueLinks.has(link),
          )
          expect(hasUniqueLinks).toEqual(true)
        })
      }
    })
  })

  describe('synchronization with scaling projects - layer2s and layer3s', () => {
    it('each scaling project should have a corresponding entry in the DA-BEAT', () => {
      // It can be squashed, but it's more readable this way
      const target = [...layer2s, ...layer3s]
        .filter(
          (project) =>
            !project.isUpcoming &&
            !project.isUnderReview &&
            !project.isArchived,
        )
        .filter(
          (project) =>
            project.display.category === 'Optimium' ||
            project.display.category === 'Validium',
        )
        .filter(
          // It makes no sense to list them on the DA-BEAT
          (scaling) => scaling.dataAvailability?.layer.value !== 'None',
        )
        .filter(
          // If project has custom DA described in the project, it will be listed on the DA-BEAT automatically
          (project) => !project.dataAvailabilitySolution,
        )

      const daBeatProjectIds = daLayers.flatMap((project) =>
        project.daLayer.bridges.flatMap((bridge) =>
          bridge.usedIn.map((usedIn) => usedIn.id),
        ),
      )

      const scalingProjectIds = target.map((project) => project.id)

      const projectsWithoutDaBeatEntry = scalingProjectIds.filter(
        (project) => !daBeatProjectIds.includes(project),
      )

      // Array comparison to have a better error message with actual names
      expect(projectsWithoutDaBeatEntry).toEqual([])
    })
  })

  describe('no duplicates among the layers', () => {
    it('should not have duplicates', () => {
      const ids = daLayers.map((layer) => layer.id)
      const uniqueIds = new Set(ids)
      expect(ids).toEqual(Array.from(uniqueIds))
    })
  })
})
