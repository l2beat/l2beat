import { assert, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { checkRisk } from '../test/helpers'
import { getTokenList } from '../tokens/tokens'
import type { ProjectBridgeTechnology, ProjectTechnologyChoice } from '../types'
import { bridges } from './bridges'
import { chains } from './chains'

const tokenList = getTokenList(chains)

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

  describe('escrows', () => {
    describe('every escrow can resolve all of its tokens', () => {
      const chainsMap = new Map<string, number | undefined>(
        chains.map((c) => [c.name, c.chainId]),
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

  describe('every escrow sinceTimestamp is greater or equal to chains sinceTimestamp', () => {
    for (const bridge of bridges) {
      for (const escrow of bridge.config.escrows) {
        const chain = chains.find((c) => c.name === escrow.chain)

        it(`${bridge.id.toString()} : ${escrow.address.toString()}`, () => {
          assert(
            chain,
            `Chain not found for escrow ${escrow.address.toString()}`,
          )
          assert(
            chain.sinceTimestamp,
            `Escrow ${escrow.address.toString()} added for chain without sinceTimestamp ${
              chain.name
            }`,
          )

          expect(escrow.sinceTimestamp).toBeGreaterThanOrEqual(
            chain.sinceTimestamp,
          )
        })
      }
    }
  })

  describe('technology', () => {
    for (const bridge of bridges) {
      describe(bridge.display.name, () => {
        type Key = Exclude<
          keyof ProjectBridgeTechnology,
          | 'canonical'
          | 'category'
          | 'destination'
          | 'isUnderReview'
          | 'detailedDescription'
          | 'upgradesAndGovernance'
          | 'upgradesAndGovernanceImage'
        >

        function check(key: Key) {
          const item = bridge.technology[key]
          if (Array.isArray(item)) {
            for (const [i, x] of item.entries()) {
              checkChoice(x, `${key}[${i}]`)
            }
          } else if (item) {
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
            it(`Milestone: ${milestone.title} (${project.display.name}) name is no longer than 50 characters`, () => {
              expect(milestone.title.length).toBeLessThanOrEqual(50)
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
            it(`Milestone: ${milestone.title} (${project.display.name}) description ends with a dot`, () => {
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
            it(`Milestone: ${milestone.title} (${project.display.name}) description is no longer than 100 characters`, () => {
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
          it(`Milestone: ${milestone.title} (${project.display.name}) date is full day`, () => {
            expect(
              UnixTime.isFull(
                UnixTime.fromDate(new Date(milestone.date)),
                'day',
              ),
            ).toEqual(true)
          })
        }
      }
    })
  })
})
