import { expect } from 'earl'
import { decodeCursor, encodeCursor, fingerprintFilters } from './cursor'

describe('interop cursor', () => {
  describe(fingerprintFilters.name, () => {
    it('ignores key order and undefined values', () => {
      expect(
        fingerprintFilters({
          plugin: 'across',
          type: undefined,
          order: 'desc',
        }),
      ).toEqual(fingerprintFilters({ order: 'desc', plugin: 'across' }))
    })

    it('changes when a filter value changes', () => {
      expect(fingerprintFilters({ plugin: 'across' })).not.toEqual(
        fingerprintFilters({ plugin: 'cctp' }),
      )
    })

    it('distinguishes a set value from an absent one', () => {
      expect(fingerprintFilters({ plugin: 'a', srcChain: 'base' })).not.toEqual(
        fingerprintFilters({ plugin: 'a' }),
      )
    })
  })

  describe(decodeCursor.name, () => {
    const fingerprint = fingerprintFilters({ plugin: 'across' })

    it('round-trips a cursor', () => {
      const encoded = encodeCursor({ timestamp: 1700, id: 'T123' }, fingerprint)

      expect(decodeCursor(encoded, fingerprint)).toEqual({
        ok: true,
        cursor: { timestamp: 1700, id: 'T123' },
      })
    })

    it('rejects a cursor issued for different filters', () => {
      const encoded = encodeCursor({ timestamp: 1700, id: 'T123' }, fingerprint)

      expect(
        decodeCursor(encoded, fingerprintFilters({ plugin: 'cctp' })),
      ).toEqual({ ok: false, reason: 'filtersChanged' })
    })

    it('rejects garbage', () => {
      expect(decodeCursor('not-a-cursor', fingerprint)).toEqual({
        ok: false,
        reason: 'malformed',
      })
    })

    it('rejects a payload that is not an object', () => {
      const encoded = Buffer.from('"nope"', 'utf8').toString('base64url')

      expect(decodeCursor(encoded, fingerprint)).toEqual({
        ok: false,
        reason: 'malformed',
      })
    })

    it('rejects a payload with wrongly typed fields', () => {
      const encoded = Buffer.from(
        JSON.stringify({ t: '1700', i: 'T123', f: fingerprint }),
        'utf8',
      ).toString('base64url')

      expect(decodeCursor(encoded, fingerprint)).toEqual({
        ok: false,
        reason: 'malformed',
      })
    })

    it('rejects a payload with a missing field', () => {
      const encoded = Buffer.from(
        JSON.stringify({ t: 1700, i: 'T123' }),
        'utf8',
      ).toString('base64url')

      expect(decodeCursor(encoded, fingerprint)).toEqual({
        ok: false,
        reason: 'malformed',
      })
    })

    it('rejects a timestamp that is not a safe integer', () => {
      for (const t of [1.5, 1e300]) {
        const encoded = Buffer.from(
          JSON.stringify({ t, i: 'T123', f: fingerprint }),
          'utf8',
        ).toString('base64url')

        expect(decodeCursor(encoded, fingerprint)).toEqual({
          ok: false,
          reason: 'malformed',
        })
      }
    })
  })
})
