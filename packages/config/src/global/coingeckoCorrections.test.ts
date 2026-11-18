import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { COINGECKO_CORRECTIONS } from './coingeckoCorrections'

// An explicit UTC time: without the Z the hour would depend on where the
// backend runs.
const FULL_HOUR_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:00:00Z$/

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
      // point off the hour would silently do nothing.
      it('lists full hours in UTC, with positive values', () => {
        expect(correction.points.length).toBeGreaterThan(0)
        for (const point of correction.points) {
          expect(point.at).toMatchRegex(FULL_HOUR_UTC)
          // a date that does not exist, like April 31, is read as May 1
          expect(new Date(point.at).toISOString()).toEqual(
            point.at.replace('Z', '.000Z'),
          )
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

  // The backend merges every entry of a coin and field into one list, where
  // the last value given for an hour silently wins.
  it('gives each hour of a coin one value', () => {
    const hours = COINGECKO_CORRECTIONS.flatMap((c) =>
      c.points.map((p) => `${c.coingeckoId} ${c.field} ${Date.parse(p.at)}`),
    )
    expect(new Set(hours).size).toEqual(hours.length)
  })
})
