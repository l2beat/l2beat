import { expect } from 'earl'

import { assert, ChainId } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { NUGGETS } from '../../common'
import { tokenList } from '../../tokens/tokens'
import { chains } from '../chains'
import { layer2s } from '../layer2s'
import { layer3s } from './index'

describe('layer3s', () => {
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
    describe('do not include www part', () => {
      for (const layer3 of layer3s) {
        it(layer3.display.name, () => {
          const links = Object.values(layer3.display.links).flat()
          for (const link of links) {
            expect(link).not.toInclude('www')
          }
        })
      }
    })
  })

  it('every layer3 has a valid host chain', () => {
    for (const layer3 of layer3s) {
      expect(layer3.hostChain).not.toBeNullish()
      const hostChain = layer2s.find((x) => x.id === layer3.hostChain)
      expect(hostChain).not.toBeNullish()
    }
  })

  describe('every escrow can resolve all of its tokens', () => {
    const chainsMap = new Map<string, ChainId>(
      chains.map((c) => [c.name, ChainId(c.chainId)]),
    )
    for (const layer3 of layer3s) {
      for (const escrow of layer3.config.escrows) {
        const chainId = chainsMap.get(escrow.chain)
        if (!chainId) continue
        const tokensOnChain = tokenList.filter((t) => t.chainId === chainId)

        if (escrow.tokens === '*') continue
        for (const token of escrow.tokens) {
          it(`${layer3.id.toString()}:${escrow.address.toString()}:${token}`, () => {
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

  describe('every escrow sinceTimestamp is greater or equal to chains minTimestampForTvl', () => {
    for (const layer3 of layer3s) {
      for (const escrow of layer3.config.escrows) {
        const chain = chains.find((c) => c.name === escrow.chain)

        it(`${layer3.id.toString()} : ${escrow.address.toString()}`, () => {
          assert(
            chain,
            `Chain not found for escrow ${escrow.address.toString()}`,
          )
          assert(
            chain.minTimestampForTvl,
            `Escrow ${escrow.address.toString()} added for chain without minTimestampForTvl ${
              chain.name
            }`,
          )

          expect(escrow.sinceTimestamp.toNumber()).toBeGreaterThanOrEqual(
            chain.minTimestampForTvl.toNumber(),
          )
        })
      }
    }
  })

  describe('sentences', () => {
    describe('every description ends with a dot', () => {
      for (const layer3 of layer3s) {
        it(layer3.display.name, () => {
          expect(layer3.display.description.endsWith('.')).toEqual(true)
        })
      }
    })
  })

  describe('milestones', () => {
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

  describe('state validation', () => {
    describe('every description ends with a dot', () => {
      for (const layer3 of layer3s) {
        if (!layer3.stateValidation) continue

        expect(layer3.stateValidation?.description.endsWith('.')).toEqual(true)
        layer3.stateValidation?.categories.forEach((category) => {
          expect(category.description.endsWith('.')).toEqual(true)
        })
      }
    })
  })

  describe('badges', () => {
    for (const layer3 of layer3s) {
      if (layer3.badges === undefined) {
        continue
      }
      it(`${layer3.display.name} does not have duplicated badges`, () => {
        expect(layer3.badges?.length).toEqual(uniq(layer3.badges).length)
      })
    }
  })
})
