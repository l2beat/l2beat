import { expect } from 'earljs'
import { utils } from 'ethers'

import { bridges } from '../src/bridges'
import { getTokenBySymbol } from '../src/tokens'

describe('bridges', () => {
  describe('every slug is valid', () => {
    for (const bridge of bridges) {
      it(bridge.slug, () => {
        expect(bridge.slug).toEqual(expect.stringMatching(/^[a-z\d]+$/))
      })
    }
  })

  describe('addresses', () => {
    describe('every addresses is valid and formatted', () => {
      const testAddress = (address: string) =>
        it(address, () => {
          expect(utils.getAddress(address)).toEqual(address)
        })

      describe('escrows', () => {
        const escrows = bridges.flatMap((x) => x.escrows.map((x) => x.address))
        for (const address of escrows) {
          testAddress(address)
        }
      })
    })
  })

  describe('every token is valid', () => {
    const symbols = bridges
      .flatMap((x) =>
        x.escrows.filter((x) => x.tokens !== '*').flatMap((x) => x.tokens),
      )
      .filter((x, i, a) => a.indexOf(x) === i)
    for (const symbol of symbols) {
      it(symbol, () => {
        expect(() => getTokenBySymbol(symbol)).not.toThrow()
      })
    }
  })
})
