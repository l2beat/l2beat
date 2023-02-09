import { assertUnreachable, EthereumAddress, ProjectId } from '@l2beat/shared'
import { expect } from 'earljs'

import { bridges, getTokenBySymbol, layer2s } from '../'
import { checkRisk, testAddress } from './helpers'

describe('projects', () => {
  describe('addresses', () => {
    describe('every addresses is valid and formatted', () => {
      describe('escrows', () => {
        const escrows = [...layer2s, ...bridges].flatMap((x) =>
          x.config.escrows.map((x) => x.address),
        )
        for (const address of escrows) {
          testAddress(address)
        }
      })

      describe('contracts', () => {
        for (const project of [...layer2s, ...bridges]) {
          const contracts = project.contracts?.addresses ?? []
          for (const contract of contracts) {
            testAddress(contract.address)
            if (!contract.upgradeability?.type) return
            switch (contract.upgradeability.type) {
              case 'Custom':
              case 'NutBerry':
                testAddress(contract.upgradeability.implementation)
                if (contract.upgradeability.admin) {
                  testAddress(contract.upgradeability.admin)
                }
                break

              case 'CustomWithoutAdmin':
                testAddress(contract.upgradeability.implementation)
                break

              case 'Beacon':
                testAddress(contract.upgradeability.beacon)
                testAddress(contract.upgradeability.implementation)
                testAddress(contract.upgradeability.beaconAdmin)
                break

              // Ignore types as they are already of type EthereumAddress
              case 'EIP1967 proxy':
              case 'ZeppelinOS proxy':
              case 'immutable':
              case 'gnosis safe':
              case 'EIP2535 diamond proxy':
              case 'StarkWare diamond':
              case 'resolved delegate proxy':
              case 'call implementation proxy':
              case 'EIP897 proxy':
              case 'StarkWare proxy':
              case 'Arbitrum proxy':
              case 'new Arbitrum proxy':
              case 'Reference':
                break

              default:
                assertUnreachable(contract.upgradeability)
            }
          }
        }
      })

      describe('permissions', () => {
        for (const project of [...layer2s, ...bridges]) {
          const permissions = project.permissions ?? []
          const permissionAddresses = permissions
            .flatMap((permission) => permission.accounts)
            .map((account) => account.address)

          for (const address of permissionAddresses) {
            testAddress(address)
          }
        }
      })
    })
  })

  describe('every token is valid', () => {
    const symbols = [...layer2s, ...bridges]
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

  describe('every slug is valid', () => {
    for (const project of [...layer2s, ...bridges]) {
      it(project.display.slug, () => {
        expect(project.display.slug).toEqual(
          expect.stringMatching(/^[a-z\-\d]+$/),
        )
      })
    }
  })

  describe('every slug is unique', () => {
    const slugs = new Set<string>()

    for (const project of [...layer2s, ...bridges]) {
      it(project.display.name, () => {
        expect(slugs.has(project.display.slug)).toEqual(false)
        slugs.add(project.display.slug)
      })
    }
  })

  describe('every id is unique', () => {
    const ids = new Set<ProjectId>()

    for (const project of [...layer2s, ...bridges]) {
      it(project.display.name, () => {
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
      })
    }
  })

  describe('every escrow is unique', () => {
    const addresses = new Set<EthereumAddress>()

    for (const project of [...layer2s, ...bridges]) {
      for (const { address } of project.config.escrows) {
        it(address, () => {
          expect(addresses.has(EthereumAddress(address))).toEqual(false)
          addresses.add(EthereumAddress(address))
        })
      }
    }
  })

  describe('contracts', () => {
    for (const project of [...layer2s, ...bridges]) {
      describe(project.display.name, () => {
        for (const [i, contract] of project.contracts?.addresses.entries() ??
          []) {
          const description = contract.description
          if (description) {
            it(`contracts[${i}].description ends with a dot`, () => {
              expect(description.endsWith('.')).toEqual(true)
            })
          }
        }

        for (const [i, risk] of project.contracts?.risks.entries() ?? []) {
          checkRisk(risk, `contracts.risks[${i}]`)
        }
      })
    }
  })

  describe('links', () => {
    describe('every project has at least one website link', () => {
      for (const project of [...layer2s, ...bridges]) {
        if (project.display.links.websites) {
          it(project.display.name, () => {
            expect(project.display.links.websites?.length).toBeGreaterThan(0)
          })
        }
      }
    })

    describe('every link is https', () => {
      const links = [...layer2s, ...bridges].flatMap((x) =>
        (Object.values(x.display.links) as string[]).flat(),
      )
      for (const link of links) {
        it(link, () => {
          expect(link).toEqual(expect.stringMatching(/^https:\/\//))
        })
      }
    })

    describe('social media links are properly formatted', () => {
      const links = [...layer2s, ...bridges].flatMap(
        (x) => x.display.links.socialMedia ?? [],
      )
      for (const link of links) {
        it(link, () => {
          if (link.includes('discord')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/discord\.gg\/[\w-]+$/),
            )
          } else if (link.includes('t.me')) {
            expect(link).toEqual(
              expect.stringMatching(/^https:\/\/t\.me\/(joinchat\/)?\w+$/),
            )
          } else if (link.includes('medium')) {
            expect(link).toEqual(
              expect.stringMatching(
                /^https:\/\/([\w-]+\.)?medium\.com\/[@\w-]*$/,
              ),
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
