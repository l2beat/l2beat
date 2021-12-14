import { expect } from 'chai'
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
        expect(project.slug).to.match(/^[a-z\d]+$/)
      })
    }
  })

  describe('addresses', () => {
    describe('every addresses is valid and formatted', () => {
      const testAddress = (address: string) =>
        it(address, () => {
          expect(utils.getAddress(address)).to.equal(address)
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
      expect(everyUnique).to.equal(true)
    })
  })

  describe('sentences', () => {
    describe('every description ends with a dot', () => {
      for (const project of projects) {
        it(project.name, () => {
          expect(project.details.description.endsWith('.')).to.equal(true)
        })
      }
    })

    describe('technology', () => {
      for (const project of projects) {
        describe(project.name, () => {
          const tech = project.details.technology

          type Key = Exclude<keyof ProjectTechnology, 'category' | 'contracts'>

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
              expect(choice.name.endsWith('.')).to.equal(false)
            })

            it(`${name}.description ends with a dot`, () => {
              expect(choice.description.endsWith('.')).to.equal(true)
            })

            describe('risks', () => {
              for (const [i, risk] of choice.risks.entries()) {
                checkRisk(risk, `${name}.risks[${i}]`)
              }
            })
          }

          function checkRisk(risk: ProjectRisk, name: string) {
            it(`${name} is correctly formatted`, () => {
              expect(risk.text).to.match(/^[a-z].*\.$/)
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
                expect(description.endsWith('.')).to.equal(true)
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
        expect(purpose.length).to.be.lessThanOrEqual(20)
      })
    }
  })

  describe('every token is valid', () => {
    const symbols = projects
      .flatMap((x) => x.bridges.flatMap((x) => x.tokens))
      .filter((x, i, a) => a.indexOf(x) === i)
    for (const symbol of symbols) {
      it(symbol, () => {
        expect(() => getTokenBySymbol(symbol)).not.to.throw()
      })
    }
  })

  describe('links', () => {
    describe('every project has at least one website link', () => {
      for (const project of projects) {
        it(project.name, () => {
          expect(project.details.links.websites.length).to.be.greaterThan(0)
        })
      }
    })

    describe('every link is https', () => {
      const links = projects.flatMap((x) =>
        Object.values(x.details.links).flat()
      )
      for (const link of links) {
        it(link, () => {
          expect(link).to.match(/^https:\/\//)
        })
      }
    })

    describe('social media links are properly formatted', () => {
      const links = projects.flatMap((x) => x.details.links.socialMedia)
      for (const link of links) {
        it(link, () => {
          if (link.includes('discord')) {
            expect(link).to.match(/^https:\/\/discord\.gg\/\w+$/)
          } else if (link.includes('t.me')) {
            expect(link).to.match(/^https:\/\/t\.me\/\w+$/)
          } else if (link.includes('medium')) {
            expect(link).to.match(/^https:\/\/medium\.com\/[@\w-]+$/)
          } else if (link.includes('twitter')) {
            expect(link).to.match(/^https:\/\/twitter\.com\/[\w-]+$/)
          } else if (link.includes('reddit')) {
            expect(link).to.match(/^https:\/\/reddit\.com\/r\/[\w-]+\/$/)
          } else if (link.includes('youtube')) {
            if (!link.includes('playlist')) {
              expect(link).to.match(
                /^https:\/\/youtube\.com\/(c|channel)\/[\w-]+$/
              )
            }
          } else if (link.includes('twitch')) {
            expect(link).to.match(/^https:\/\/twitch\.tv\/[\w-]+$/)
          } else if (link.includes('gitter')) {
            expect(link).to.match(/^https:\/\/gitter\.im\/[\w-/]+$/)
          } else if (link.includes('instagram')) {
            expect(link).to.match(/^https:\/\/instagram\.com\/[\w-/]+$/)
          }
        })
      }
    })
  })
})
