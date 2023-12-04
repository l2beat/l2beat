import {
  EthereumAddress,
  gatherAddressesFromUpgradeability,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { startsWith } from 'lodash'

import {
  ProjectReference,
  ProjectRiskViewEntry,
  ProjectTechnologyChoice,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { FunctionCallParams, Layer2Technology, NUGGETS } from '../layer2s'
import { checkRisk } from '../test/helpers'
import { layer3s } from './index'

describe('layer2s', () => {
  describe('links', () => {
    describe('all links do not contain spaces', () => {
      for (const layer3 of layer3s) {
        it(layer3.display.name, () => {
          const links = Object.values(layer3.display.links).flat()
          for (const link of links) {
            expect(link).not.toInclude(' ')
          }
        })
      }
    })
  })

  describe('escrows', () => {
    describe('every escrow in new format resolves to discovery entry', () => {
      for (const layer3 of layer3s) {
        try {
          const discovery = new ProjectDiscovery(layer3.id.toString())

          for (const escrow of layer3.config.escrows.filter(
            (e) => e.newVersion && !e.isHistorical,
          )) {
            it(`${layer3.id.toString()} : ${escrow.address.toString()}`, () => {
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
      for (const layer3 of layer3s) {
        if (!layer3.isUpcoming) continue

        for (const escrow of layer3.config.escrows) {
          expect(escrow.isUpcoming).toEqual(true)
        }
      }
    })

    it('every not upcoming project does not have isUpcoming flag', () => {
      for (const layer3 of layer3s) {
        if (layer3.isUpcoming) continue

        for (const escrow of layer3.config.escrows) {
          expect([false, undefined]).toInclude(escrow.isUpcoming)
        }
      }
    })
  })

  describe('liveness', () => {
    for (const project of layer3s) {
      it(`${project.id.toString()} : has valid signatures`, () => {
        if (project.config.liveness) {
          const functionCalls = [
            ...project.config.liveness.batchSubmissions,
            ...project.config.liveness.stateUpdates,
          ].filter((x) => x.formula === 'functionCall') as FunctionCallParams[]

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

  describe('activity', () => {
    describe('custom URL starts with https', () => {
      const layers2WithUrls = layer3s.flatMap((layer2) => {
        const { transactionApi } = layer2.config

        if (transactionApi && 'url' in transactionApi && transactionApi.url) {
          return {
            id: layer2.id,
            url: transactionApi.url,
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
      const opAndArbL2sWithActivity = layer3s
        .filter((layer3) => {
          const { provider } = layer3.display
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
      for (const layer3 of layer3s) {
        try {
          const discovery = new ProjectDiscovery(layer3.id.toString())

          for (const [riskName, riskEntry] of Object.entries(layer3.riskView)) {
            const risk = riskEntry as ProjectRiskViewEntry
            if (risk.sources === undefined) continue

            describe(`${layer3.id.toString()} : ${riskName}`, () => {
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

    describe('permissions references are valid', () => {
      for (const layer3 of layer3s) {
        try {
          const discovery = new ProjectDiscovery(layer3.id.toString())

          if (layer3.permissions === 'UnderReview') continue

          for (const { name, references } of layer3.permissions ?? []) {
            const referencedAddresses = getAddressFromReferences(references)
            if (referencedAddresses.length === 0) continue

            it(`${layer3.id.toString()} : ${name}`, () => {
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

  describe('sentences', () => {
    describe('every description ends with a dot', () => {
      for (const layer3 of layer3s) {
        it(layer3.display.name, () => {
          expect(layer3.display.description.endsWith('.')).toEqual(true)
        })
      }
    })

    describe('technology', () => {
      for (const layer3 of layer3s) {
        describe(layer3.display.name, () => {
          type Key = Exclude<
            keyof Layer2Technology,
            'category' | 'provider' | 'isUnderReview' //TODO: Add test for permissions
          >

          function check(key: Key) {
            const item = layer3.technology[key]
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
          check('additionalPrivacy')
          check('smartContracts')
        })
      }
    })
  })

  describe('every purpose is short', () => {
    const purposes = layer3s.map((x) => x.display.purpose)
    for (const purpose of purposes) {
      it(purpose, () => {
        expect(purpose.length).toBeLessThanOrEqual(20)
      })
    }
  })

  describe('date', () => {
    for (const project of layer3s) {
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
    const knowledgeNuggets = layer3s.flatMap(
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
    for (const layer3 of layer3s) {
      if (
        layer3.stage.stage === 'UnderReview' ||
        layer3.stage.stage === 'NotApplicable'
      ) {
        continue
      }
      for (const item of layer3.stage.summary) {
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

function getAddressFromReferences(references: ProjectReference[] = []) {
  const addresses = references.map((r) => r.href)
  return getReferencedAddresses(addresses)
}

export function getReferencedAddresses(addresses: string[] = []) {
  return [...addresses.join(';').matchAll(/0x[a-fA-F0-9]{40}/g)].map((e) =>
    EthereumAddress(e[0]),
  )
}
