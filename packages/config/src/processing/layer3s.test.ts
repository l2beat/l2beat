import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import uniq from 'lodash/uniq'
import { getTokenList } from '../tokens/tokens'
import { chains } from './chains'
import { ecosystems } from './ecosystems'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'

const tokenList = getTokenList(chains)

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

  describe('others', () => {
    for (const layer3 of layer3s) {
      it(`every project with reasonsForBeingOther has Other category: ${layer3.display.name}`, () => {
        if (layer3.reasonsForBeingOther) {
          expect(layer3.display.category === 'Other').toEqual(true)
        }
      })

      it(`every Other project has reasonsForBeingOther configured: ${layer3.display.name}`, () => {
        if (layer3.display.category === 'Other') {
          expect(!!layer3.reasonsForBeingOther).toEqual(true)
        }
      })
    }
  })

  describe('ecosystems', () => {
    const ecosystemIds = ecosystems.map((e) => e.id)
    for (const layer3 of layer3s) {
      it(`every project with ecosystemInfo has valid ecosystem configured: ${layer3.display.name}`, () => {
        if (layer3.ecosystemInfo) {
          expect(ecosystemIds).toInclude(layer3.ecosystemInfo.id)
        }
      })
    }
  })

  it('every layer3 has a valid config', () => {
    for (const layer3 of layer3s) {
      expect(layer3.hostChain).not.toBeNullish()
      const hostChain = layer2s.find((x) => x.id === layer3.hostChain)
      expect(hostChain).not.toBeNullish()

      expect(layer3.stackedRiskView).not.toBeNullish()

      expect(layer3.config.trackedTxs).toEqual(undefined)
      expect(layer3.config.liveness).toEqual(undefined)
      expect(layer3.display.liveness).toEqual(undefined)
    }
  })

  describe('every escrow can resolve all of its tokens', () => {
    const chainsMap = new Map<string, number | undefined>(
      chains.map((c) => [c.name, c.chainId]),
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

  describe('every escrow sinceTimestamp is greater or equal to chains sinceTimestamp', () => {
    for (const layer3 of layer3s) {
      for (const escrow of layer3.config.escrows) {
        const chain = chains.find((c) => c.name === escrow.chain)

        it(`${layer3.id.toString()} : ${escrow.address.toString()}`, () => {
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

  describe('sentences', () => {
    describe('every description ends with a dot', () => {
      for (const layer3 of layer3s) {
        it(layer3.display.name, () => {
          expect(layer3.display.description.endsWith('.')).toEqual(true)
        })
      }
    })
  })

  describe('state validation', () => {
    describe('every description ends with a dot', () => {
      for (const layer3 of layer3s) {
        if (!layer3.stateValidation) continue

        if (layer3.stateValidation.description) {
          expect(layer3.stateValidation.description.endsWith('.')).toEqual(true)
        }
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
