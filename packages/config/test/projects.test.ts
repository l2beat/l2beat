import { expect } from 'earljs'
import { utils } from 'ethers'

import {
  ProjectRisk,
  projects,
  ProjectTechnology,
  ProjectTechnologyChoice,
} from '../src/projects'
import { getTokenBySymbol } from '../src/tokens'

describe('projects', () => {
  describe('every slug is valid', () => {
    for (const project of projects) {
      it(project.slug, () => {
        expect(project.slug).toEqual(expect.stringMatching(/^[a-z\d]+$/))
      })
    }
  })

  describe('addresses', () => {
    describe('every addresses is valid and formatted', () => {
      const testAddress = (address: string) =>
        it(address, () => {
          expect(utils.getAddress(address)).toEqual(address)
        })

      describe('bridges', () => {
        const bridges = projects.flatMap((x) => x.bridges.map((x) => x.address))
        for (const address of bridges) {
          testAddress(address)
        }
      })

      describe('contracts', () => {
        for (const project of projects) {
          const contracts = project.details.technology.contracts.addresses
          for (const contract of contracts) {
            testAddress(contract.address)
            if (
              contract.upgradeability?.type === 'EIP1967' ||
              contract.upgradeability?.type === 'NutBerry' ||
              contract.upgradeability?.type === 'ZeppelinOs'
            ) {
              testAddress(contract.upgradeability.admin)
              testAddress(contract.upgradeability.implementation)
            }
            if (contract.upgradeability?.type === 'StarkWare') {
              testAddress(contract.upgradeability.implementation)
              if (contract.upgradeability.callImplementation) {
                testAddress(contract.upgradeability.callImplementation)
              }
            }
          }
        }
      })
    })

    it('every bridge has a unique address', () => {
      const bridges = projects.flatMap((x) => x.bridges.map((x) => x.address))
      const everyUnique = bridges.every((x, i, a) => a.indexOf(x) === i)
      expect(everyUnique).toEqual(true)
    })
  })

  describe('sentences', () => {
    describe('every description ends with a dot', () => {
      for (const project of projects) {
        it(project.name, () => {
          expect(project.details.description.endsWith('.')).toEqual(true)
        })
      }
    })

    describe('technology', () => {
      for (const project of projects) {
        describe(project.name, () => {
          const tech = project.details.technology

          type Key = Exclude<
            keyof ProjectTechnology,
            'category' | 'contracts' | 'permissions' //TODO: Add test for permissions
          >

          function check(key: Key) {
            const item = tech[key]
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

          function checkRisk(risk: ProjectRisk, name: string) {
            it(`${name} is correctly formatted`, () => {
              expect(risk.text).toEqual(expect.stringMatching(/^[a-z].*\.$/))
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

          for (const [i, contract] of tech.contracts.addresses.entries()) {
            const description = contract.description
            if (description) {
              it(`contracts[${i}].description ends with a dot`, () => {
                expect(description.endsWith('.')).toEqual(true)
              })
            }
          }

          for (const [i, risk] of tech.contracts.risks.entries()) {
            checkRisk(risk, `contracts.risks[${i}]`)
          }
        })
      }
    })
  })

  describe('every purpose is short', () => {
    const purposes = projects.map((x) => x.details.purpose)
    for (const purpose of purposes) {
      it(purpose, () => {
        expect(purpose.length).toBeLessThanOrEqualTo(20)
      })
    }
  })

  describe('every token is valid', () => {
    const symbols = projects
      .flatMap((x) =>
        x.bridges.filter((x) => x.tokens !== '*').flatMap((x) => x.tokens),
      )
      .filter((x, i, a) => a.indexOf(x) === i)
    for (const symbol of symbols) {
      it(symbol, () => {
        expect(() => getTokenBySymbol(symbol)).not.toThrow()
      })
    }
  })

  describe('links', () => {
    describe('every project has at least one website link', () => {
      for (const project of projects) {
        it(project.name, () => {
          expect(project.details.links.websites.length).toBeGreaterThan(0)
        })
      }
    })

    describe('every link is https', () => {
      const links = projects.flatMap((x) =>
        (Object.values(x.details.links) as string[]).flat(),
      )
      for (const link of links) {
        it(link, () => {
          expect(link).toEqual(expect.stringMatching(/^https:\/\//))
        })
      }
    })

    describe('social media links are properly formatted', () => {
      const links = projects.flatMap((x) => x.details.links.socialMedia)
      for (const link of links) {
        it(link, () => {
          if (link.includes('discord')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/discord\.gg\/\w+$/),
            )
          } else if (link.includes('t.me')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/t\.me\/\w+$/),
            )
          } else if (link.includes('medium')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/medium\.com\/[@\w-]+$/),
            )
          } else if (link.includes('twitter')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/twitter\.com\/[\w-]+$/),
            )
          } else if (link.includes('reddit')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/reddit\.com\/r\/[\w-]+\/$/),
            )
          } else if (link.includes('youtube')) {
            if (!link.includes('playlist')) {
              expect(link).toEqual(
                expect.stringMatching(
                  /^https:\/\/youtube\.com\/(c|channel)\/[\w-]+$/,
                ),
              )
            }
          } else if (link.includes('twitch')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/twitch\.tv\/[\w-]+$/),
            )
          } else if (link.includes('gitter')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/gitter\.im\/[\w-/]+$/),
            )
          } else if (link.includes('instagram')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/instagram\.com\/[\w-/]+$/),
            )
          }
        })
      }
    })
  })
})
