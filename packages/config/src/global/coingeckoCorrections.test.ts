import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { COINGECKO_CORRECTIONS } from './coingeckoCorrections'

const HOUR_MS = 3_600_000

describe('COINGECKO_CORRECTIONS', () => {
  // A correction is matched to TVS data by id alone, so a typo would silently
  // correct nothing. Look each id up in the serialized TVS configs, where a
  // price shows as "priceId" and a circulating supply as "apiId".
  const tvsConfigs = JSON.stringify(
    getProjects()
      .filter((p) => p.tvsConfig)
      .map((p) => p.tvsConfig),
  )
  const fieldKey = { price: 'priceId', circulatingSupply: 'apiId' } as const

  for (const correction of COINGECKO_CORRECTIONS) {
    describe(`${correction.coingeckoId} ${correction.field}`, () => {
      it('targets data that some TVS token uses', () => {
        const usage = `"${fieldKey[correction.field]}":"${correction.coingeckoId}"`
        expect(tvsConfigs.includes(usage)).toEqual(true)
      })

      it('says why and points to evidence', () => {
        expect(correction.reason.length).toBeGreaterThan(0)
        expect(correction.evidence.length).toBeGreaterThan(0)
      })

      // The backend matches a point to stored data by its exact hour, so a
      // point off the hour or a repeated hour would silently do nothing.
      it('lists each full hour once, with a positive value', () => {
        const times = correction.points.map((p) => Date.parse(p.at))
        expect(times.length).toBeGreaterThan(0)
        expect(new Set(times).size).toEqual(times.length)
        for (const time of times) {
          expect(time % HOUR_MS).toEqual(0)
        }
        for (const point of correction.points) {
          expect(point.value).toBeGreaterThan(0)
        }
      })

      // A supply is converted to BigInt, which throws on a fraction and would
      // halt the indexer.
      if (correction.field === 'circulatingSupply') {
        it('gives supplies in whole tokens', () => {
          for (const point of correction.points) {
            expect(Number.isInteger(point.value)).toEqual(true)
          }
        })
      }
    })
  }
})
