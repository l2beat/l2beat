import { expect } from 'chai'
import { utils } from 'ethers'
import { projects } from '../src/projects'
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
    const addresses = projects.flatMap((x) => x.bridges.map((x) => x.address))

    describe('every addresses is valid and formatted', () => {
      for (const address of addresses) {
        it(address, () => {
          expect(utils.getAddress(address)).to.equal(address)
        })
      }
    })

    it('every bridge has a unique address', () => {
      const everyUnique = addresses.every((x, i) => addresses.indexOf(x) === i)
      expect(everyUnique).to.equal(true)
    })
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
})
