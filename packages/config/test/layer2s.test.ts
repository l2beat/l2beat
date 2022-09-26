import { expect } from 'earljs'
import { utils } from 'ethers'

import { ProjectRisk, ProjectTechnologyChoice } from '../src/common'
import { layer2s, Layer2Technology } from '../src/layer2s'
import { getTokenBySymbol } from '../src/tokens'

describe('layer2s', () => {
  describe('addresses', () => {
    describe('every addresses is valid and formatted', () => {
      const testAddress = (address: string) =>
        it(address, () => {
          expect(utils.getAddress(address)).toEqual(address)
        })

      describe('escrows', () => {
        const escrows = layer2s.flatMap((x) =>
          x.config.escrows.map((x) => x.address),
        )
        for (const address of escrows) {
          testAddress(address)
        }
      })

      describe('contracts', () => {
        for (const layer2 of layer2s) {
          const contracts = layer2.contracts.addresses
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
  })

  describe('sentences', () => {
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
            keyof Layer2Technology,
            'category' | 'provider' //TODO: Add test for permissions
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
        })
      }
    })
  })

  describe('contracts', () => {
    for (const layer2 of layer2s) {
      for (const [i, contract] of layer2.contracts.addresses.entries()) {
        const description = contract.description
        if (description) {
          it(`contracts[${i}].description ends with a dot`, () => {
            expect(description.endsWith('.')).toEqual(true)
          })
        }
      }

      for (const [i, risk] of layer2.contracts.risks.entries()) {
        it(`contracts.risks[${i}] is correctly formatted`, () => {
          expect(risk.text).toEqual(expect.stringMatching(/^[a-z].*\.$/))
        })
      }
    }
  })

  describe('every purpose is short', () => {
    const purposes = layer2s.map((x) => x.display.purpose)
    for (const purpose of purposes) {
      it(purpose, () => {
        expect(purpose.length).toBeLessThanOrEqualTo(20)
      })
    }
  })

  describe('every token is valid', () => {
    const symbols = layer2s
      .flatMap((x) =>
        x.config.escrows
          .filter((x) => x.tokens !== '*')
          .flatMap((x) => x.tokens),
      )
      .filter((x, i, a) => a.indexOf(x) === i)
    for (const symbol of symbols) {
      it(symbol, () => {
        expect(() => getTokenBySymbol(symbol)).not.toThrow()
      })
    }
  })

  describe('links', () => {
    describe('every layer2 has at least one website link', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          expect(layer2.display.links.websites.length).toBeGreaterThan(0)
        })
      }
    })

    describe('every link is https', () => {
      const links = layer2s.flatMap((x) =>
        (Object.values(x.display.links) as string[]).flat(),
      )
      for (const link of links) {
        it(link, () => {
          expect(link).toEqual(expect.stringMatching(/^https:\/\//))
        })
      }
    })

    describe('social media links are properly formatted', () => {
      const links = layer2s.flatMap((x) => x.display.links.socialMedia)
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
