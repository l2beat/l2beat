import {
  assert,
  EthereumAddress,
  UnixTime,
  assertUnreachable,
  notUndefined,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { uniq } from 'lodash'
import { describe } from 'mocha'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectScalingTechnology } from '../internalTypes'
import { checkRisk } from '../test/helpers'
import { getTokenList } from '../tokens/tokens'
import type { ProjectTechnologyChoice, ReferenceLink } from '../types'
import { chains } from './chains'
import { layer2s, milestonesLayer2s } from './layer2s'

const tokenList = getTokenList(chains)

describe('layer2s', () => {
  it('l2s do not have a host chain', () => {
    for (const layer2 of layer2s) {
      expect(layer2.hostChain).toEqual(undefined)
      expect(layer2.stackedRiskView).toEqual(undefined)
    }
  })

  describe('links', () => {
    describe('all links do not contain spaces', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          const links = Object.values(layer2.display.links).flat()
          for (const link of links) {
            expect(link).not.toInclude(' ')
          }
        })
      }
    })
    describe('do not include www part', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          const links = Object.values(layer2.display.links).flat()
          for (const link of links) {
            expect(link).not.toInclude('www')
          }
        })
      }
    })
  })

  describe('escrows', () => {
    describe('every escrow in new format resolves to discovery entry', () => {
      for (const layer2 of layer2s) {
        // NOTE(radomski): PolygonCDK projects have a shared escrow
        if (layer2.display.stack === 'Polygon') continue

        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())

          for (const escrow of layer2.config.escrows.filter(
            (e) => e.contract && !e.isHistorical,
          )) {
            it(`${layer2.id.toString()} : ${escrow.address.toString()}`, () => {
              // try to resolve escrow by address
              // if it does not exist the assert will throw
              discovery.getContractByAddress(escrow.address.toString())
            })
          }
        } catch {
          continue
        }
      }
    })

    it('every escrow of upcoming project has isUpcoming flag', () => {
      for (const layer2 of layer2s) {
        if (!layer2.isUpcoming) continue

        for (const escrow of layer2.config.escrows) {
          expect(escrow.isUpcoming).toEqual(true)
        }
      }
    })

    it('every not upcoming project does not have isUpcoming flag', () => {
      for (const layer2 of layer2s) {
        if (layer2.isUpcoming) continue

        for (const escrow of layer2.config.escrows) {
          expect([false, undefined]).toInclude(escrow.isUpcoming)
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
              expect(foundToken).not.toBeNullish()
            })
          }
        }
      }
    })
  })

  describe('chain name equals project id', () => {
    for (const layer2 of layer2s) {
      const name = layer2.chainConfig?.name
      // polygon-pos is the exception
      if (name !== undefined && layer2.id !== 'polygon-pos') {
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
            expect(costMultipliers?.every((m) => m > 0 && m <= 1)).toEqual(true)
          })
        }
      }
    })

    it('every current address is present in discovery', () => {
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
              discovery.getContractByAddress(a.toString())
            })
          }
        })
      }
    })
  })

  describe('finality', () => {
    describe('every project with finality enabled has finalizationPeriod property', () => {
      const projectsWithFinality = layer2s.filter((p) => p.config.finality)
      for (const project of projectsWithFinality) {
        it(project.id.toString(), () => {
          expect(project.display.finality?.finalizationPeriod).not.toBeNullish()
        })
      }
    })
  })

  describe('activity', () => {
    describe('all arbitrum and op stack chains have the assessCount defined', () => {
      const opAndArbL2sWithActivity = layer2s
        .filter((layer2) => {
          const { stack } = layer2.display
          return stack === 'Arbitrum' || stack === 'OP Stack'
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
        it(`${id.toString()}`, () => {
          expect(assessCount).not.toBeNullish()
        })
      }
    })
  })

  describe('references', () => {
    describe('permissions references are valid', () => {
      for (const layer2 of layer2s) {
        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())

          for (const perChain of Object.values(layer2.permissions ?? {})) {
            const all = [...(perChain.roles ?? []), ...(perChain.actors ?? [])]
            for (const { name, references } of all) {
              const referencedAddresses = getAddressFromReferences(references)
              if (referencedAddresses.length === 0) continue

              it(`${layer2.id.toString()} : ${name}`, () => {
                const contractAddresses = discovery.getAllContractAddresses()
                expect(
                  contractAddresses.some((a) =>
                    referencedAddresses.includes(a),
                  ),
                ).toEqual(true)
              })
            }
          }
        } catch {
          continue
        }
      }
    })

    describe('technology references are valid', () => {
      for (const layer2 of layer2s) {
        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())
          if (layer2.technology.isUnderReview === true) continue

          for (const [key, choicesAny] of Object.entries(layer2.technology)) {
            if (choicesAny === undefined) {
              continue
            }
            it(`${layer2.id.toString()} : ${key}`, () => {
              const choicesTyped = choicesAny as
                | ProjectTechnologyChoice
                | ProjectTechnologyChoice[]

              const choices = Array.isArray(choicesTyped)
                ? choicesTyped
                : [choicesTyped]
              const referencedAddresses = getReferencedAddresses(
                choices.flatMap((c) => c.references).map((ref) => ref.url),
              )

              const allAddresses = discovery
                .getAllContractAddresses()
                .concat(discovery.getContractsAndEoas().map((m) => m.address))
              for (const address of referencedAddresses) {
                expect(allAddresses.includes(address)).toBeTruthy()
              }
            })
          }
        } catch {
          continue
        }
      }
    })
  })

  describe('display', () => {
    describe('every description ends with a dot', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          expect(layer2.display.description.endsWith('.')).toEqual(true)
        })
      }
    })

    describe('technology', () => {
      for (const layer2 of layer2s) {
        describe(layer2.display.name, () => {
          type Key = Exclude<
            keyof ProjectScalingTechnology,
            'category' | 'provider' | 'isUnderReview' //TODO: Add test for permissions
          >

          function check(key: Key) {
            const item = layer2.technology[key]
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

          check('stateCorrectness')
          check('newCryptography')
          check('dataAvailability')
          check('operator')
          check('forceTransactions')
          check('exitMechanisms')
          check('massExit')
          check('otherConsiderations')
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
              expect(milestone.description?.endsWith('.')).toEqual(true)
            })
          }
        }
        for (const milestone of milestonesLayer2s) {
          if (milestone.description === undefined) {
            continue
          }
          it(`Milestone: ${milestone.title} (main page) description ends with a dot`, () => {
            expect(milestone.description?.endsWith('.')).toEqual(true)
          })
        }
      })
      describe('no longer that 100 characters', () => {
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
      for (const project of layer2s) {
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
      for (const milestone of milestonesLayer2s) {
        it(`Milestone: ${milestone.title} (main page) date is full day`, () => {
          expect(
            UnixTime.isFull(UnixTime.fromDate(new Date(milestone.date)), 'day'),
          ).toEqual(true)
        })
      }
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
              expect(req.description.endsWith('.')).toEqual(true)
            })
          }
        }
      }
    })
  })

  describe('state validation', () => {
    describe('every description ends with a dot', () => {
      for (const layer2 of layer2s) {
        if (!layer2.stateValidation) continue

        expect(layer2.stateValidation?.description.endsWith('.')).toEqual(true)
        layer2.stateValidation?.categories.forEach((category) => {
          expect(category.description.endsWith('.')).toEqual(true)
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

function getAddressFromReferences(references: ReferenceLink[] = []) {
  const addresses = references.map((r) => r.url)
  return getReferencedAddresses(addresses)
}

export function getReferencedAddresses(addresses: string[] = []) {
  return [...addresses.join(';').matchAll(/0x[a-fA-F0-9]{40}/g)].map((e) =>
    EthereumAddress(e[0]),
  )
}
