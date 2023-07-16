import {
  gatherAddressesFromUpgradeability,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { ProjectRiskViewEntry } from '../common'
import { ProjectTechnologyChoice } from '../common/ProjectTechnologyChoice'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { NUGGETS } from '../layer2s'
import { getReferencedAddresses } from '../layer2s/index.test'
import { checkRisk } from '../test/helpers'
import { bridges, BridgeTechnology } from './index'

describe('bridges', () => {
  describe('links', () => {
    describe('all links do not contain spaces', () => {
      for (const bridge of bridges) {
        it(bridge.display.name, () => {
          const links = Object.values(bridge.display.links).flat()
          for (const link of links) {
            expect(link).not.toInclude(' ')
          }
        })
      }
    })
  })
  describe('references', () => {
    describe('points to an existing implementation', () => {
      for (const bridge of bridges) {
        try {
          const discovery = new ProjectDiscovery(bridge.id.toString())

          for (const [riskName, riskEntry] of Object.entries(
            bridge.riskView ?? {},
          )) {
            const risk = riskEntry as ProjectRiskViewEntry
            if (risk.sources === undefined) continue

            describe(`${bridge.id.toString()} : ${riskName}`, () => {
              for (const sourceCodeReference of risk.sources ?? []) {
                it(sourceCodeReference.contract, () => {
                  const referencedAddresses = getReferencedAddresses(
                    sourceCodeReference.references,
                  )
                  const contract = discovery.getContract(
                    sourceCodeReference.contract,
                  )

                  const contractAddresses = [
                    contract.address,
                    ...gatherAddressesFromUpgradeability(
                      contract.upgradeability,
                    ),
                  ]

                  expect(
                    contractAddresses.some((a) =>
                      referencedAddresses.includes(a),
                    ),
                  ).toEqual(true)
                })
              }
            })
          }
        } catch {
          continue
        }
      }
    })
  })

  describe('technology', () => {
    for (const bridge of bridges) {
      describe(bridge.display.name, () => {
        type Key = Exclude<
          keyof BridgeTechnology,
          'canonical' | 'category' | 'destination' | 'isUnderReview'
        >

        function check(key: Key) {
          const item = bridge.technology[key]
          if (item) {
            checkChoice(item, key)
          }
        }

        function checkChoice(choice: ProjectTechnologyChoice, name: string) {
          it(`${name}.name doesn't end with a dot`, () => {
            expect(choice.name.endsWith('.')).toEqual(false)
          })

          it(`${name}.description ends with a dot`, () => {
            expect(choice.description.endsWith('.')).toEqual(true)
          })

          describe('risks', () => {
            for (const [i, risk] of choice.risks.entries()) {
              checkRisk(risk, `${name}.risks[${i}]`)
            }
          })
        }

        check('principleOfOperation')
        check('validation')
        check('destinationToken')
      })
    }
  })

  describe('milestones', () => {
    describe('name', () => {
      describe('no longer than 50 characters', () => {
        for (const project of bridges) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            it(`Milestone: ${milestone.name} (${project.display.name}) name is no longer than 50 characters`, () => {
              expect(milestone.name.length).toBeLessThanOrEqual(50)
            })
          }
        }
      })
    })

    describe('description', () => {
      describe('ends with dot', () => {
        for (const project of bridges) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            if (milestone.description === undefined) {
              continue
            }
            it(`Milestone: ${milestone.name} (${project.display.name}) description ends with a dot`, () => {
              expect(milestone.description?.endsWith('.')).toEqual(true)
            })
          }
        }
      })
      describe('no longer that 100 characters', () => {
        for (const project of bridges) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            if (milestone.description === undefined) {
              continue
            }
            it(`Milestone: ${milestone.name} (${project.display.name}) description is no longer than 100 characters`, () => {
              expect(milestone.description?.length ?? 0).toBeLessThanOrEqual(
                100,
              )
            })
          }
        }
      })
    })

    describe('date', () => {
      for (const project of bridges) {
        if (project.milestones === undefined) {
          continue
        }
        for (const milestone of project.milestones) {
          it(`Milestone: ${milestone.name} (${project.display.name}) date is full day`, () => {
            expect(
              UnixTime.fromDate(new Date(milestone.date)).isFull('day'),
            ).toEqual(true)
          })
        }
      }
    })

    describe('knowledgeNuggets', () => {
      const knowledgeNuggets = bridges.flatMap(
        (nugget) => nugget.knowledgeNuggets ?? [],
      )

      describe('title fits character limit', () => {
        knowledgeNuggets.forEach((nugget) => {
          it(nugget.title, () => {
            expect(nugget.title.length).toBeLessThanOrEqual(40)
          })
        })
      })

      describe('uses static thumbnail', () => {
        const staticThumbnails = Object.values(NUGGETS.THUMBNAILS)
        knowledgeNuggets
          .filter((x) => x.thumbnail !== undefined)
          .forEach((nugget) => {
            it(nugget.title, () => {
              expect(staticThumbnails).toInclude(nugget.thumbnail!)
            })
          })
      })
    })
  })
})
