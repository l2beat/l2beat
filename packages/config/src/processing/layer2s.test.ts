import {
  assert,
  assertUnreachable,
  ChainSpecificAddress,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import uniq from 'lodash/uniq'
import { describe, expect, it } from 'vitest'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectScalingTechnology } from '../internalTypes'
import { checkRisk } from '../test/helpers'
import { getTokenList } from '../tokens/tokens'
import type { ProjectTechnologyChoice } from '../types'
import { chains } from './chains'
import { ecosystems } from './ecosystems'
import { layer2s, milestonesLayer2s } from './layer2s'

const tokenList = getTokenList(chains)

describe('layer2s', () => {
  it('l2s do not have a host chain', () => {
    for (const layer2 of layer2s) {
      expect(layer2.hostChain).toBe(undefined)
      expect(layer2.stackedRiskView).toBe(undefined)
    }
  })

  describe('ecosystems', () => {
    const ecosystemIds = ecosystems.map((e) => e.id)
    it('every project with ecosystemInfo has valid ecosystem configured', () => {
      for (const layer2 of layer2s) {
        if (layer2.ecosystemInfo) {
          expect(ecosystemIds).toContain(layer2.ecosystemInfo.id)
        }
      }
    })

    it('uses isPartOfSuperchain only for superchain', () => {
      for (const layer2 of layer2s) {
        if (layer2.ecosystemInfo?.isPartOfSuperchain) {
          expect(layer2.ecosystemInfo?.id).toEqual(ProjectId('superchain'))
        }
      }
    })
  })

  describe('links', () => {
    describe('all links do not contain spaces', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          const links = Object.values(layer2.display.links).flat()
          for (const link of links) {
            expect(link).not.toContain(' ')
          }
        })
      }
    })
    describe('do not include www part', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          const links = Object.values(layer2.display.links).flat()
          for (const link of links) {
            expect(link).not.toContain('www')
          }
        })
      }
    })
  })

  describe('escrows', () => {
    describe('every escrow in new format resolves to discovery entry', () => {
      for (const layer2 of layer2s) {
        // NOTE(radomski): PolygonCDK projects have a shared escrow
        if (layer2.display.stacks?.includes('Agglayer CDK')) continue

        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())

          for (const escrow of layer2.config.escrows.filter(
            (e) => e.contract && !e.isHistorical,
          )) {
            it(`${layer2.id.toString()} : ${escrow.address.toString()}`, () => {
              // try to resolve escrow by address
              // if it does not exist the assert will throw
              discovery.getContractByAddress(
                ChainSpecificAddress.from('eth', escrow.address),
              )
            })
          }
        } catch {
          continue
        }
      }
    })

    describe('every escrow sinceTimestamp is greater or equal to chains sinceTimestamp', () => {
      for (const layer2 of layer2s) {
        for (const escrow of layer2.config.escrows) {
          const chain = chains.find((c) => c.name === escrow.chain)

          it(`${layer2.id.toString()} : ${escrow.address.toString()}`, () => {
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

    describe('every escrow can resolve all of its tokens', () => {
      const chainsMap = new Map<string, number | undefined>(
        chains.map((c) => [c.name, c.chainId]),
      )
      for (const layer2 of layer2s) {
        for (const escrow of layer2.config.escrows) {
          const chainId = chainsMap.get(escrow.chain)
          if (!chainId) continue
          const tokensOnChain = tokenList.filter((t) => t.chainId === chainId)

          if (escrow.tokens === '*') continue
          for (const token of escrow.tokens) {
            it(`${layer2.id.toString()}:${escrow.address.toString()}:${token}`, () => {
              const foundToken = tokensOnChain.find((t) => t.symbol === token)

              assert(
                foundToken,
                `Please add token with symbol ${token} on ${escrow.chain} chain`,
              )
              expect(foundToken == null).toBe(false)
            })
          }
        }
      }
    })
  })

  describe('chain name equals project id', () => {
    for (const layer2 of layer2s) {
      const name = layer2.chainConfig?.name
      const exceptions = ['polygon-pos', 'apex-pro']
      if (name !== undefined && !exceptions.includes(layer2.id)) {
        it(layer2.id.toString(), () => {
          expect(name).toEqual(layer2.id.toString())
        })
      }
    }
  })

  describe('tracked transactions', () => {
    describe('every tracked transaction which is function call has valid signatures', () => {
      for (const project of layer2s) {
        it(`${project.id.toString()} : has valid signatures`, () => {
          if (project.config.trackedTxs?.length !== 0) {
            const functionCalls = project.config.trackedTxs
              ?.map((t) => t.query)
              .filter((x) => x.formula === 'functionCall') as {
              selector: string
              functionSignature: string
            }[]

            functionCalls?.forEach((c) => {
              const i = new utils.Interface([c.functionSignature])
              const fragment = i.fragments[0]
              const calculatedSignature = i.getSighash(fragment)
              expect(calculatedSignature).toEqual(c.selector)
            })
          }
        })
      }
    })

    describe('every cost multiplier is in 0 to 1 range', () => {
      for (const project of layer2s) {
        if (project.config.trackedTxs) {
          it(`${project.id.toString()} : has valid cost multipliers`, () => {
            const costMultipliers = project.config.trackedTxs
              ?.map((t) => t._hackCostMultiplier)
              .filter(notUndefined)
            expect(costMultipliers?.every((m) => m > 0 && m <= 1)).toBe(true)
          })
        }
      }
    })

    describe('every current address is present in discovery', () => {
      for (const project of layer2s) {
        it(`${project.id.toString()} : has valid addresses`, () => {
          if (project.config.trackedTxs) {
            const queries = project.config.trackedTxs.map((t) => t.query)

            const addresses = queries
              // .filter((x) => x.untilTimestamp === undefined)
              .flatMap((x) => {
                switch (x.formula) {
                  case 'functionCall':
                    return [x.address]
                  case 'transfer':
                    return []
                  case 'sharpSubmission':
                    return []
                  case 'sharedBridge':
                    return []
                  default:
                    assertUnreachable(x)
                }
              })

            const discovery = new ProjectDiscovery(project.id.toString())
            addresses.forEach((a) => {
              discovery.getContractByAddress(
                ChainSpecificAddress.from('eth', a),
              )
            })
          }
        })
      }
    })
  })

  describe('activity', () => {
    describe('all arbitrum and op stack chains have the assessCount defined', () => {
      const opAndArbL2sWithActivity = layer2s
        .filter((layer2) => {
          const { stacks: stack } = layer2.display
          return stack?.includes('Arbitrum') || stack?.includes('OP Stack')
        })
        .flatMap((layer2) => {
          const { activityConfig } = layer2.config

          if (activityConfig && activityConfig.type === 'block') {
            return {
              id: layer2.id,
              assessCount: activityConfig.adjustCount,
            }
          }

          return []
        })

      for (const { id, assessCount } of opAndArbL2sWithActivity) {
        if (id === 'zircuit') {
          // we skip zircuit, it is an anomaly. the research team decided to not
          // do any adjustment and overcount by 1/6.
          continue
        }
        it(`${id.toString()}`, () => {
          expect(assessCount == null).toBe(false)
        })
      }
    })
  })

  describe('references', () => {
    for (const layer2 of layer2s) {
      it(`${layer2.id.toString()}`, () => {
        const discoveryAddresses = new Set(
          new ProjectDiscovery(layer2.id)
            .getTopLevelAddresses()
            .map((address) =>
              ChainSpecificAddress.address(address).toString().toLowerCase(),
            ),
        )

        const referencedAddresses = new Set(
          JSON.stringify(layer2)
            .match(/address\/(0x[a-fA-F0-9]{40})/g)
            ?.map((match) => match.slice(8).toLowerCase()) || [],
        )

        for (const address of referencedAddresses) {
          assert(
            discoveryAddresses.has(address),
            `${layer2.id} references ${address} but it's not found in discovery`,
          )
        }
      })
    }
  })

  describe('display', () => {
    describe('every description ends with a dot', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          expect(layer2.display.description.endsWith('.')).toBe(true)
        })
      }
    })

    describe('technology', () => {
      for (const layer2 of layer2s) {
        const choices = namedTechnologyChoices(layer2.technology)
        // A project that fills in none of the checked fields has nothing to
        // assert, and vitest fails a suite that registers no tests.
        if (choices.length === 0) {
          continue
        }

        describe(layer2.display.name, () => {
          for (const [name, choice] of choices) {
            it(`${name}.name doesn't end with a dot`, () => {
              expect(choice.name.endsWith('.')).toBe(false)
            })

            it(`${name}.description ends with a dot`, () => {
              expect(choice.description.endsWith('.')).toBe(true)
            })

            if (choice.risks.length > 0) {
              describe('risks', () => {
                for (const [i, risk] of choice.risks.entries()) {
                  checkRisk(risk, `${name}.risks[${i}]`)
                }
              })
            }
          }
        })
      }
    })
  })

  describe('others', () => {
    for (const layer2 of layer2s) {
      it(`${layer2.id} does not have duplicated reasons for being other`, () => {
        const labels = layer2.reasonsForBeingOther?.map(
          (reason) => reason.label,
        )
        expect(labels?.length).toEqual(labels ? uniq(labels).length : undefined)
      })
    }

    describe('live projects without proof system have reasons for being other', () => {
      const liveProjectsWithoutProofSystem = layer2s.filter(
        (layer2) => !layer2.archivedAt && !layer2.proofSystem,
      )

      for (const layer2 of liveProjectsWithoutProofSystem) {
        it(`${layer2.id} should have reasons for being other`, () => {
          expect(layer2.reasonsForBeingOther?.length ?? 0).toBeGreaterThan(0)
        })
      }
    })
  })

  describe('milestones', () => {
    describe('name', () => {
      describe('no longer than 50 characters', () => {
        for (const project of layer2s) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            it(`Milestone: ${milestone.title} (${project.display.name}) name is no longer than 50 characters`, () => {
              expect(milestone.title.length).toBeLessThanOrEqual(50)
            })
          }
        }
        for (const milestone of milestonesLayer2s) {
          it(`Milestone: ${milestone.title} (main page) name is no longer than 50 characters`, () => {
            expect(milestone.title.length).toBeLessThanOrEqual(50)
          })
        }
      })
    })

    describe('description', () => {
      describe('ends with dot', () => {
        for (const project of layer2s) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            if (milestone.description === undefined) {
              continue
            }
            it(`Milestone: ${milestone.title} (${project.display.name}) description ends with a dot`, () => {
              expect(milestone.description?.endsWith('.')).toBe(true)
            })
          }
        }
        for (const milestone of milestonesLayer2s) {
          if (milestone.description === undefined) {
            continue
          }
          it(`Milestone: ${milestone.title} (main page) description ends with a dot`, () => {
            expect(milestone.description?.endsWith('.')).toBe(true)
          })
        }
      })
      describe('no longer than 100 characters', () => {
        for (const project of layer2s) {
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
        for (const milestone of milestonesLayer2s) {
          if (milestone.description === undefined) {
            continue
          }
          it(`Milestone: ${milestone.title} (main page) description is no longer than 100 characters`, () => {
            expect(milestone.description?.length ?? 0).toBeLessThanOrEqual(100)
          })
        }
      })
    })

    describe('date', () => {
      const allMilestones = [
        ...milestonesLayer2s,
        ...layer2s.flatMap((l) => l.milestones ?? []),
      ]
      it('is full day', () => {
        for (const milestone of allMilestones ?? []) {
          expect(
            UnixTime.isFull(UnixTime.fromDate(new Date(milestone.date)), 'day'),
          ).toBe(true)
        }
      })

      it('is correct', () => {
        for (const milestone of allMilestones ?? []) {
          expect(new Date(milestone.date).getTime()).not.toEqual(Number.NaN)
        }
      })
    })
  })

  describe('stages', () => {
    describe('every description ends with a dot', () => {
      for (const layer2 of layer2s) {
        if (
          layer2.stage.stage === 'UnderReview' ||
          layer2.stage.stage === 'NotApplicable'
        ) {
          continue
        }
        for (const item of layer2.stage.summary) {
          for (const req of item.requirements) {
            if (req.description.includes('[View code]')) {
              continue
            }
            it(req.description, () => {
              expect(req.description.endsWith('.')).toBe(true)
            })
          }
        }
      }
    })
  })

  describe('state validation', () => {
    it('every description ends with a dot', () => {
      for (const layer2 of layer2s) {
        if (!layer2.stateValidation) continue

        if (layer2.stateValidation.description) {
          expect(layer2.stateValidation.description.endsWith('.')).toBe(true)
        }
        layer2.stateValidation?.categories.forEach((category) => {
          expect(category.description.endsWith('.')).toBe(true)
        })
      }
    })
  })

  describe('badges', () => {
    for (const layer2 of layer2s) {
      if (layer2.badges === undefined) {
        continue
      }
      it(`${layer2.display.name} does not have duplicated badges`, () => {
        expect(layer2.badges?.length).toEqual(uniq(layer2.badges).length)
      })
    }
  })
})

type TechnologyKey = Exclude<
  keyof ProjectScalingTechnology,
  'category' | 'provider' | 'isUnderReview' //TODO: Add test for permissions
>

const TECHNOLOGY_KEYS: TechnologyKey[] = [
  'dataAvailability',
  'operator',
  'forceTransactions',
  'exitMechanisms',
  'massExit',
  'otherConsiderations',
]

/** Every technology choice worth checking, paired with the name it is reported
 * under. A key holding an array contributes one entry per element. */
function namedTechnologyChoices(
  technology: ProjectScalingTechnology | undefined,
): [string, ProjectTechnologyChoice][] {
  return TECHNOLOGY_KEYS.flatMap((key): [string, ProjectTechnologyChoice][] => {
    const item = technology?.[key]
    if (Array.isArray(item)) {
      return item.map((x, i) => [`${key}[${i}]`, x])
    }
    return item ? [[key, item]] : []
  })
}
