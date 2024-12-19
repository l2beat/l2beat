import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { daLayers } from '.'
import { layer2s } from '../../layer2s'
import { layer3s } from '../../layer3s'

describe('DA-BEAT', () => {
  daLayers.forEach((layer) => {
    describe(layer.display.name, () => {
      it('should contain description with dot at the end', () => {
        expect(layer.display.description.endsWith('.')).toEqual(true)
      })

      layer.bridges.forEach((bridge) => {
        describe(bridge.display.name, () => {
          it(`should contain bridge description with dot at the end`, () => {
            expect(bridge.display.description.endsWith('.')).toEqual(true)
          })
        })
      })
    })

    describe(`${layer.display.name} does not have duplicated links`, () => {
      const getFlatLinks = (links: Record<string, string[]>) =>
        Object.values(links).flatMap((link) => link)

      const links = getFlatLinks(layer.display.links)
      const uniqueLinks = new Set(links)

      for (const bridge of layer.bridges) {
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
          (scaling) =>
            getLatestDataAvailabilityEntry(scaling.dataAvailability)?.layer
              .value !== 'None',
        )

      const daBeatProjectIds = daLayers.flatMap((daLayer) =>
        daLayer.bridges.flatMap((bridge) =>
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

function getLatestDataAvailabilityEntry<
  T extends { sinceTimestamp?: UnixTime; untilTimestamp?: UnixTime },
>(entries: T[] | null | undefined) {
  const now = UnixTime.now()
  return entries?.find(
    (entry) =>
      (!entry.sinceTimestamp || entry.sinceTimestamp.lte(now)) &&
      (!entry.untilTimestamp || entry.untilTimestamp.gt(now)),
  )
}
