import type { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from './getProjects'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'

describe('getProjects', () => {
  const projects = getProjects()

  describe('every project has a unique id', () => {
    const ids = new Set<ProjectId>()
    for (const project of projects) {
      it(`${project.name} has a unique id of: "${project.id}"`, () => {
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
      })
    }
  })

  describe('display.description ends with a dot', () => {
    for (const project of projects) {
      if (project.display) {
        it(project.name, () => {
          expect(project.display?.description.endsWith('.')).toEqual(true)
        })
      }
      if (project.daBridges) {
        for (const bridge of project.daBridges) {
          it(bridge.display.name, () => {
            expect(bridge.display.description.endsWith('.')).toEqual(true)
          })
        }
      }
    }
  })

  describe('verifier descriptions end with a dot', () => {
    for (const project of projects) {
      if (!project.proofVerification) {
        return
      }
      describe(project.name, () => {
        project.proofVerification?.verifiers.forEach((sV) => {
          it(sV.name, () => {
            expect(sV.description.endsWith('.')).toEqual(true)
          })
        })
      })
    }
  })

  describe('synchronization with scaling projects - layer2s and layer3s', () => {
    it('each scaling project should have a corresponding entry in the DA-BEAT', () => {
      // It can be squashed, but it's more readable this way
      const target = [...layer2s, ...layer3s].filter(
        (project) =>
          !project.isUpcoming &&
          !project.isUnderReview &&
          !project.isArchived &&
          // TODO: Ideally the category check should be removed, but
          // hyperliquid and polygon-pos are exceptions that would fail the test
          (project.display.category === 'Optimium' ||
            project.display.category === 'Validium') &&
          // It makes no sense to list them on the DA-BEAT
          project.dataAvailability &&
          project.dataAvailability.layer.value !== 'None' &&
          // Will be listed on the DA-BEAT automatically
          !project.customDa,
      )

      const daLayers = projects.filter((x) => x.daLayer !== undefined)

      const daBeatProjectIds = daLayers.flatMap((project) =>
        project.daLayer?.usedWithoutBridgeIn
          .concat(project.daBridges?.flatMap((bridge) => bridge.usedIn) ?? [])
          .map((usedIn) => usedIn.id),
      )

      const scalingProjectIds = target.map((project) => project.id)

      const projectsWithoutDaBeatEntry = scalingProjectIds.filter(
        (project) => !daBeatProjectIds.includes(project),
      )

      // Array comparison to have a better error message with actual names
      expect(projectsWithoutDaBeatEntry).toEqual([])
    })
  })
})
