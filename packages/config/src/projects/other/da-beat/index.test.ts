import { expect } from 'earl'
import { daLayers } from '.'

describe('da-beat', () => {
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
})
