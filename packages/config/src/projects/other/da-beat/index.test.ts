import { expect } from 'earl'
import { daLayers } from '.'

describe.only('da-beat', () => {
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
  })
})
