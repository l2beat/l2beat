import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { bridges } from '../processing/bridges'
import { chains } from '../processing/chains'
import {
  getDiscoveryTokenList,
  getGeneratedTokenList,
  getTokenList,
} from './tokens'

const tokenList = getTokenList(chains)

describe('tokens', () => {
  it('every token has a unique address and chainId', () => {
    const tokens = tokenList.map((x) =>
      JSON.stringify({
        address: x.address,
        chainId: x.chainId,
      }),
    )
    const everyUnique = tokens.every((x, i) => tokens.indexOf(x) === i)
    expect(everyUnique).toEqual(true)
  })

  it('every token has a unique id', () => {
    const ids = tokenList.map((x) => x.id)
    const everyUnique = ids.every((x, i) => ids.indexOf(x) === i)
    expect(everyUnique).toEqual(true)
  })

  it('every token has a chain with sinceTimestamp', () => {
    for (const token of tokenList) {
      const chain = chains.find((c) => c.chainId === +token.chainId)
      assert(chain, `Chain not found for token ${token.symbol}`)
      assert(
        chain.sinceTimestamp,
        `Token ${token.symbol} added for chain without sinceTimestamp ${chain.name}`,
      )
    }
  })

  describe('external', () => {
    it('every external token has a bridgedUsing property', () => {
      const externalTokens = tokenList
        .filter((token) => token.source === 'external' && !token.bridgedUsing)
        .map((token) => token.symbol)
      expect(externalTokens).toHaveLength(0)
    })
    it('every bridge slug in bridgedUsing property is valid', () => {
      const tokenSlugs = tokenList
        .filter(
          (token) =>
            token.source === 'external' &&
            token.bridgedUsing?.bridges.some((b) => b.slug),
        )
        .flatMap((token) => token.bridgedUsing?.bridges.map((b) => b.slug))
      const bridgesSlugs = bridges.map((bridge) => bridge.display.slug)
      const invalidSlugs = tokenSlugs.filter(
        (slug) => !bridgesSlugs.includes(slug!),
      )

      expect(invalidSlugs).toHaveLength(0)
    })
  })

  describe('tokens sources – no duplicates between generated.json and discovery', () => {
    const generatedTokens = getGeneratedTokenList(chains)
    const discoveryTokens = getDiscoveryTokenList(chains)

    it('no token appears in both generated.json and discovery output', () => {
      const generatedKeys = new Set<string>()

      for (const t of generatedTokens) {
        if (!t.address) continue // native assets have no address – skip
        generatedKeys.add(t.id)
      }

      const duplicates: string[] = []

      for (const token of discoveryTokens) {
        if (!token.address) continue
        if (generatedKeys.has(token.id)) {
          duplicates.push(token.id)
        }
      }

      expect(duplicates).toEqual([])
    })
  })
})
