import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { NUGGETS } from '../common'
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
  it('every layer3 has a valid host chain except those with Multiple', () => {
    for (const layer3 of layer3s.filter((x) => x.hostChain !== 'Multiple')) {
      expect(layer3.hostChain).not.toBeNullish()
      const hostChain = layer2s.find((x) => x.id === layer3.hostChain)
      expect(hostChain).not.toBeNullish()
    }
  })

  describe('every contract and escrow in layer3 has a chain different than ethereum', () => {
    for (const layer3 of layer3s) {
      it(layer3.display.name, () => {
        const contracts = layer3.contracts.addresses
        const escrows = layer3.config.escrows
        for (const contract of contracts) {
          expect(contract.chain).not.toBeNullish()
          expect(contract.chain).not.toEqual('ethereum')
        }
        for (const escrow of escrows) {
          expect(escrow.newVersion).toEqual(true)
          assert(escrow.newVersion) // to make typescript happy
          expect(escrow.contract.chain).not.toBeNullish()
          expect(escrow.contract.chain).not.toEqual('ethereum')
        }
      })
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

  describe('every purpose is short', () => {
    const purposes = layer3s.map((x) => x.display.purposes)
    for (const purpose of purposes) {
      const totalLength = purpose.reduce((acc, curr) => {
        return acc + curr.length
      }, 0)
      it(purpose.join(', '), () => {
        expect(totalLength).toBeLessThanOrEqual(20)
      })
    }
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
})
