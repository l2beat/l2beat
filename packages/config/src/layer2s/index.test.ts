import {
  assertUnreachable,
  EthereumAddress,
  gatherAddressesFromUpgradeability,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { startsWith } from 'lodash'

import {
  NUGGETS,
  ScalingProjectReference,
  ScalingProjectRiskViewEntry,
  ScalingProjectTechnologyChoice,
} from '../common'
import { ScalingProjectTechnology } from '../common/ScalingProjectTechnology'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { checkRisk } from '../test/helpers'
import { layer2s, milestonesLayer2s } from './index'

describe('layer2s', () => {
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
        if (layer2.display.provider === 'Polygon') continue

        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())

          for (const escrow of layer2.config.escrows.filter(
            (e) => e.newVersion && !e.isHistorical,
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
  })

  describe('chain name equals project id', () => {
    for (const layer2 of layer2s) {
      const name = layer2.chainConfig?.name
      if (name !== undefined) {
        it(layer2.id.toString(), () => {
          expect(name).toEqual(layer2.id.toString())
        })
      }
    }
  })

  describe('tracked transactions', () => {
    it('every tracked transaction which is function call has valid signatures', () => {
      for (const project of layer2s) {
        it(`${project.id.toString()} : has valid signatures`, () => {
          if (project.config.trackedTxs?.length !== 0) {
            const functionCalls = project.config.trackedTxs
              ?.map((t) => t.query)
              .filter((x) => x.formula === 'functionCall') as {
              selector: string
              functionSignature: string
            }[]

            functionCalls.forEach((c) => {
              const i = new utils.Interface([c.functionSignature])
              const fragment = i.fragments[0]
              const calculatedSignature = i.getSighash(fragment)
              expect(calculatedSignature).toEqual(c.selector)
            })
          }
        })
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
    describe('custom URL starts with https', () => {
      const layers2WithUrls = layer2s.flatMap((layer2) => {
        const { transactionApi } = layer2.config

        if (
          transactionApi &&
          'defaultUrl' in transactionApi &&
          transactionApi.defaultUrl
        ) {
          return {
            id: layer2.id,
            url: transactionApi.defaultUrl,
          }
        }

        return []
      })

      for (const { id, url } of layers2WithUrls) {
        it(`${id.toString()} : ${url}`, () => {
          expect(url).toSatisfy((url: string) => startsWith(url, 'https://'))
        })
      }
    })

    describe('all arbitrum and op stack chains have the assessCount defined', () => {
      const opAndArbL2sWithActivity = layer2s
        .filter((layer2) => {
          const { provider } = layer2.display
          return provider === 'Arbitrum' || provider === 'OP Stack'
        })
        .flatMap((layer2) => {
          const { transactionApi } = layer2.config

          if (transactionApi && transactionApi.type === 'rpc') {
            return {
              id: layer2.id,
              assessCount: transactionApi.assessCount,
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
    describe('points to an existing implementation', () => {
      for (const layer2 of layer2s) {
        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())

          for (const [riskName, riskEntry] of Object.entries(layer2.riskView)) {
            const risk = riskEntry as ScalingProjectRiskViewEntry
            if (risk.sources === undefined) continue

            describe(`${layer2.id.toString()} : ${riskName}`, () => {
              for (const sourceCodeReference of risk.sources ?? []) {
                it(sourceCodeReference.contract, () => {
                  const referencedAddresses = getReferencedAddresses(
                    sourceCodeReference.references,
                  )

                  if (referencedAddresses.length > 0) {
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
                  }
                })
              }
            })
          }
        } catch {
          continue
        }
      }
    })

    describe('permissions references are valid', () => {
      for (const layer2 of layer2s) {
        try {
          const discovery = new ProjectDiscovery(layer2.id.toString())

          if (layer2.permissions === 'UnderReview') continue

          for (const { name, references } of layer2.permissions ?? []) {
            const referencedAddresses = getAddressFromReferences(references)
            if (referencedAddresses.length === 0) continue

            it(`${layer2.id.toString()} : ${name}`, () => {
              const contractAddresses = discovery.getAllContractAddresses()
              expect(
                contractAddresses.some((a) => referencedAddresses.includes(a)),
              ).toEqual(true)
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
            keyof ScalingProjectTechnology,
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

  describe('every purpose is short', () => {
    const purposes = layer2s.map((x) => x.display.purposes)
    for (const purpose of purposes) {
      const totalLength = purpose.reduce((acc, curr) => {
        return acc + curr.length
      }, 0)
      it(purpose.join(', '), () => {
        expect(totalLength).toBeLessThanOrEqual(20)
      })
    }
  })

  describe('milestones', () => {
    describe('name', () => {
      describe('no longer than 50 characters', () => {
        for (const project of layer2s) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            it(`Milestone: ${milestone.name} (${project.display.name}) name is no longer than 50 characters`, () => {
              expect(milestone.name.length).toBeLessThanOrEqual(50)
            })
          }
        }
        for (const milestone of milestonesLayer2s) {
          it(`Milestone: ${milestone.name} (main page) name is no longer than 50 characters`, () => {
            expect(milestone.name.length).toBeLessThanOrEqual(50)
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
            it(`Milestone: ${milestone.name} (${project.display.name}) description ends with a dot`, () => {
              expect(milestone.description?.endsWith('.')).toEqual(true)
            })
          }
        }
        for (const milestone of milestonesLayer2s) {
          if (milestone.description === undefined) {
            continue
          }
          it(`Milestone: ${milestone.name} (main page) description ends with a dot`, () => {
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
            it(`Milestone: ${milestone.name} (${project.display.name}) description is no longer than 100 characters`, () => {
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
          it(`Milestone: ${milestone.name} (main page) description is no longer than 100 characters`, () => {
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
          it(`Milestone: ${milestone.name} (${project.display.name}) date is full day`, () => {
            expect(
              UnixTime.fromDate(new Date(milestone.date)).isFull('day'),
            ).toEqual(true)
          })
        }
      }
      for (const milestone of milestonesLayer2s) {
        it(`Milestone: ${milestone.name} (main page) date is full day`, () => {
          expect(
            UnixTime.fromDate(new Date(milestone.date)).isFull('day'),
          ).toEqual(true)
        })
      }
    })

    describe('knowledgeNuggets', () => {
      const knowledgeNuggets = layer2s.flatMap(
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
})

function getAddressFromReferences(references: ScalingProjectReference[] = []) {
  const addresses = references.map((r) => r.href)
  return getReferencedAddresses(addresses)
}

export function getReferencedAddresses(addresses: string[] = []) {
  return [...addresses.join(';').matchAll(/0x[a-fA-F0-9]{40}/g)].map((e) =>
    EthereumAddress(e[0]),
  )
}
