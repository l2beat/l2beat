import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { bridges, getCanonicalTokenBySymbol, layer2s } from '../'
import { checkRisk } from './helpers'

describe('projects', () => {
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
        expect(() => getCanonicalTokenBySymbol(symbol)).not.toThrow()
      })
    }
  })

  describe('every slug is valid', () => {
    for (const project of [...layer2s, ...bridges]) {
      it(project.display.slug, () => {
        expect(project.display.slug).toMatchRegex(/^[a-z\-\d]+$/)
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
      // NOTE(radomski): PolygonCDK projects have a shared escrow
      if (
        'provider' in project.display &&
        project.display.provider === 'Polygon'
      ) {
        continue
      }

      for (const { address } of project.config.escrows) {
        it(address.toString(), () => {
          expect(addresses.has(address)).toEqual(false)
          addresses.add(address)
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

          if ('address' in contract && project.permissions !== 'UnderReview') {
            const upgradableBy = contract.upgradableBy
            const actors = project.permissions?.map((x) => x.name) ?? []
            if (upgradableBy) {
              it(`contracts[${i}].upgradableBy is valid`, () => {
                expect(actors).toInclude(...upgradableBy)
              })
            }
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
            expect(project.display.links.websites?.length ?? 0).toBeGreaterThan(
              0,
            )
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
          expect(link).toMatchRegex(/^https:\/\//)
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
            expect(link).toMatchRegex(
              /^https:\/\/discord\.(gg|com\/invite)\/[\w-]+$/,
            )
          } else if (link.includes('t.me')) {
            expect(link).toMatchRegex(/^https:\/\/t\.me\/(joinchat\/)?\w+$/)
          } else if (link.includes('medium')) {
            expect(link).toMatchRegex(
              /^https:\/\/([\w-]+\.)?medium\.com\/[@\w-]*$/,
            )
          } else if (link.includes('twitter')) {
            expect(link).toMatchRegex(/^https:\/\/twitter\.com\/[\w-]+$/)
          } else if (link.includes('reddit')) {
            expect(link).toMatchRegex(/^https:\/\/reddit\.com\/r\/[\w-]+\/$/)
          } else if (link.includes('youtube')) {
            if (!link.includes('playlist')) {
              expect(link).toMatchRegex(
                /^https:\/\/youtube\.com\/((c|channel)\/|@)[\w-]+$/,
              )
            }
          } else if (link.includes('twitch')) {
            expect(link).toMatchRegex(/^https:\/\/twitch\.tv\/[\w-]+$/)
          } else if (link.includes('gitter')) {
            expect(link).toMatchRegex(/^https:\/\/gitter\.im\/[\w-/]+$/)
          } else if (link.includes('instagram')) {
            expect(link).toMatchRegex(/^https:\/\/instagram\.com\/[\w-./]+$/)
          }
        })
      }
    })
  })
})
