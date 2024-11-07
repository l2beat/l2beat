import { expect } from 'earl'
import { daLayers } from '.'
import { layer2s } from '../../layer2s'
import { layer3s } from '../../layer3s'

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
  })

  describe('scaling projects in sync', () => {
    const target = [...layer2s, ...layer3s]
      .filter(
        (project) =>
          !project.isUpcoming && !project.isUnderReview && !project.isArchived,
      )
      .filter(
        (project) =>
          project.display.category === 'Optimium' ||
          project.display.category === 'Validium',
      )

    it('should have all DACs from scaling projects assigned', () => {
      const scalingDACs = target
        .filter((project) => project.dataAvailability?.layer.value === 'DAC')
        .map((project) => project.id)

      const daBeatDACs = daLayers.filter((daLayer) => daLayer.kind === 'DAC')

      const usedInDaBeatDACs = daBeatDACs.flatMap((daLayer) =>
        daLayer.bridges.flatMap((bridge) =>
          bridge.usedIn.map((usedIn) => usedIn.id),
        ),
      )

      const projectsWithoutDaBeatEntry = scalingDACs.filter(
        (project) => !usedInDaBeatDACs.includes(project),
      )

      // Array comparison to have a better error message with actual names
      expect(projectsWithoutDaBeatEntry).toEqual([])
    })
  })
})
