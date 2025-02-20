import {
  assert,
  type EthereumAddress,
  type ProjectId,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { bridges } from '../projects/bridges'
import { layer2s } from '../projects/layer2s'
import { layer3s } from '../projects/layer3s'
import type { Layer2, Layer3 } from '../types'
import { isDiscoveryDriven } from '../utils/discoveryDriven'
import { NON_DISCOVERY_DRIVEN_PROJECTS } from './constants'

describe('projects', () => {
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
    it('layer2s', () => {
      const addressToKey = (address: EthereumAddress, chain: string) =>
        `${address.toString()} (${chain})`
      const addresses = new Set<string>()

      for (const project of layer2s) {
        for (const { address, chain } of project.config.escrows) {
          it(address.toString(), () => {
            const key = addressToKey(address, chain ?? 'ethereum')
            expect(addresses.has(key)).toEqual(false)
            addresses.add(key)
          })
        }
      }
    })

    it('bridges', () => {
      const addressToKey = (address: EthereumAddress, chain: string) =>
        `${address.toString()} (${chain})`
      const addresses = new Set<string>()

      for (const project of bridges) {
        for (const { address, chain } of project.config.escrows) {
          it(address.toString(), () => {
            const key = addressToKey(address, chain ?? 'ethereum')
            expect(addresses.has(key)).toEqual(false)
            addresses.add(key)
          })
        }
      }
    })
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
            expect(link).toMatchRegex(
              /^https:\/\/t\.me\/(joinchat\/)?[\w\-+]+$/,
            )
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

  describe('all new projects are discovery driven', () => {
    const isNormalProject = (p: Layer2 | Layer3) => {
      return (
        p.isArchived !== true &&
        p.isUpcoming !== true &&
        p.isUnderReview !== true
      )
    }

    const allProjects: (Layer2 | Layer3)[] = [...layer2s, ...layer3s]
    const projects = allProjects.filter(
      (p) =>
        isNormalProject(p) &&
        !NON_DISCOVERY_DRIVEN_PROJECTS.includes(p.id.toString()),
    )

    for (const p of projects) {
      it(`${p.id.toString()} is discovery driven`, () => {
        assert(
          isDiscoveryDriven(p),
          'New projects are expected to be discovery driven. Read the comment in constants.ts',
        )
      })
    }
  })

  // TODO: refactor config so there are no more zeroes, resync data
  describe('daTracking', () => {
    // Some of the projects have sinceBlock set to zero because they were added at DA Module start
    const excluded = new Set([
      'aevo',
      'ancient',
      'arbitrum',
      'base',
      'bob',
      'fuel',
      'hypr',
      'ink',
      'karak',
      'kinto',
      'kroma',
      'linea',
      'loopring',
      'lyra',
      'eclipse',
      'mantapacific',
      'mint',
      'morph',
      'optimism',
      'orderly',
      'paradex',
      'polynomial',
      'scroll',
      'sophon',
      'starknet',
      'superlumio',
      'taiko',
      'b3',
      'deri',
      'ham',
      'rari',
      'stack',
    ])
    // All new projects should have non-zero sinceBlock - it will make sync more efficient
    describe('every project has non-zero sinceBlock', () => {
      for (const project of [...layer2s, ...layer3s]) {
        if (project.config.daTracking) {
          if (!excluded.has(project.id)) {
            it(project.id, () => {
              assert(project.config.daTracking) // type issue
              for (const config of project.config.daTracking) {
                expect(config.sinceBlock).toBeGreaterThan(0)
              }
            })
          }
        }
      }
    })
  })
})
