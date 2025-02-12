import { assert, type ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'
import { getProjects } from './getProjects'
import { checkRisk } from '../../test/helpers'

describe('getProjects', () => {
  const projects = getProjects()

  describe('every project has a unique id and slug', () => {
    const ids = new Set<ProjectId>()
    const slugs = new Set<string>()
    for (const project of projects) {
      it(`${project.name} id: ${project.id}, slug: ${project.slug}`, () => {
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
        if (project.slug === 'payy' || project.slug === 'near') {
          // Those two projects are exceptions!
          // Both should most likely be merged with their duplicates
          // Right now it only works because refactored projects are resolved
          // first when querying by slug
          return
        }
        expect(slugs.has(project.slug)).toEqual(false)
        slugs.add(project.slug)
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
      const daBridges = projects.filter((x) => x.daBridge !== undefined)

      const daBeatProjectIds = daLayers
        .flatMap((project) => project.daLayer?.usedWithoutBridgeIn ?? [])
        .concat(daBridges.flatMap((bridge) => bridge.daBridge?.usedIn ?? []))
        .map((usedIn) => usedIn.id)

      const scalingProjectIds = target.map((project) => project.id)

      const projectsWithoutDaBeatEntry = scalingProjectIds.filter(
        (project) => !daBeatProjectIds.includes(project),
      )

      // Array comparison to have a better error message with actual names
      expect(projectsWithoutDaBeatEntry).toEqual([])
    })
  })

  describe('contracts', () => {
    for (const project of getProjects()) {
      describe(project.id, () => {
        const contracts = project.contracts?.addresses ?? {}
        for (const [chain, perChain] of Object.entries(contracts)) {
          for (const [i, contract] of perChain.entries()) {
            const description = contract.description
            if (description) {
              it(`contracts[${i}].description - each line ends with a dot`, () => {
                for (const descLine of description.trimEnd().split('\n')) {
                  expect(descLine.trimEnd().endsWith('.')).toEqual(true)
                }
              })
            }

            it(`contracts[${chain}][${i}] name isn't empty`, () => {
              expect(contract.name.trim().length).toBeGreaterThan(0)
            })
            const upgradableBy = contract.upgradableBy
            const permissionsForChain = (project.permissions ?? {})[chain]
            const all = [
              ...(permissionsForChain?.roles ?? []),
              ...(permissionsForChain?.actors ?? []),
            ]
            const actors = all.map((x) => {
              if (x.name === 'EOA') {
                assert(x.accounts[0].type === 'EOA')
                return x.accounts[0].address
              }
              return x.name
            })

            if (upgradableBy) {
              it(`contracts[${chain}][${i}].upgradableBy is valid`, () => {
                expect(actors).toInclude(...upgradableBy)
              })
            }
          }
        }

        for (const [i, risk] of project.contracts?.risks.entries() ?? []) {
          checkRisk(risk, `contracts.risks[${i}]`)
        }
      })
    }
  })

})
