import { assert, ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { get$Implementations } from '@l2beat/discovery-types'
import { chains } from '../../chains'
import {
  NUGGETS,
  ScalingProjectRiskViewEntry,
  ScalingProjectTechnologyChoice,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { checkRisk } from '../../test/helpers'
import { tokenList } from '../../tokens/tokens'
import { getReferencedAddresses } from '../layer2s/index.test'
import { BridgeTechnology, bridges } from './index'

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
    describe('do not include www part', () => {
      for (const bridge of bridges) {
        it(bridge.display.name, () => {
          const links = Object.values(bridge.display.links).flat()
          for (const link of links) {
            expect(link).not.toInclude('www')
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
            const risk = riskEntry as ScalingProjectRiskViewEntry
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
                    ...get$Implementations(contract.values),
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

  describe('escrows', () => {
    describe('every escrow can resolve all of its tokens', () => {
      const chainsMap = new Map<string, ChainId>(
        chains.map((c) => [c.name, ChainId(c.chainId)]),
      )
      for (const bridge of bridges) {
        for (const escrow of bridge.config.escrows) {
          const chainId = chainsMap.get(escrow.chain)
          if (!chainId) continue
          const tokensOnChain = tokenList.filter((t) => t.chainId === chainId)

          if (escrow.tokens === '*') continue
          for (const token of escrow.tokens) {
            it(`${bridge.id.toString()}:${escrow.address.toString()}:${token}`, () => {
              const foundToken = tokensOnChain.find((t) => t.symbol === token)

              assert(
                foundToken,
                `Please add token with symbol ${token} on ${escrow.chain} chain`,
              )
              expect(foundToken).not.toBeNullish()
            })
          }
        }
      }
    })
  })

  describe('every escrow sinceTimestamp is greater or equal to chains minTimestampForTvl', () => {
    for (const bridge of bridges) {
      for (const escrow of bridge.config.escrows) {
        const chain = chains.find((c) => c.name === escrow.chain)

        it(`${bridge.id.toString()} : ${escrow.address.toString()}`, () => {
          assert(
            chain,
            `Chain not found for escrow ${escrow.address.toString()}`,
          )
          assert(
            chain.minTimestampForTvl,
            `Escrow ${escrow.address.toString()} added for chain without minTimestampForTvl ${
              chain.name
            }`,
          )

          expect(escrow.sinceTimestamp.toNumber()).toBeGreaterThanOrEqual(
            chain.minTimestampForTvl.toNumber(),
          )
        })
      }
    }
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

        function checkChoice(
          choice: ScalingProjectTechnologyChoice,
          name: string,
        ) {
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
