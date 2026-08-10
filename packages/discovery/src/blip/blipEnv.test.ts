import { expect } from 'earl'
import { executeBlip } from './executeBlip'
import type { BlipEnv } from './type'

describe('BLIP env operator', () => {
  const env: BlipEnv = {
    blockNumber: 21_000_000,
    timestamp: 1_700_000_000,
    chainName: 'ethereum',
    address: '0x1234567890123456789012345678901234567890',
  }

  describe('reading values', () => {
    it('reads blockNumber', () => {
      expect(executeBlip({}, ['env', 'blockNumber'], env)).toEqual(21_000_000)
    })

    it('reads timestamp', () => {
      expect(executeBlip({}, ['env', 'timestamp'], env)).toEqual(1_700_000_000)
    })

    it('reads chainName', () => {
      expect(executeBlip({}, ['env', 'chainName'], env)).toEqual('ethereum')
    })

    it('reads address', () => {
      expect(executeBlip({}, ['env', 'address'], env)).toEqual(
        '0x1234567890123456789012345678901234567890',
      )
    })

    it('ignores the piped input value', () => {
      expect(executeBlip({ timestamp: 1 }, ['env', 'timestamp'], env)).toEqual(
        1_700_000_000,
      )
    })
  })

  describe('use inside operations', () => {
    it('compares an env value against a literal', () => {
      expect(
        executeBlip({}, ['=', ['env', 'chainName'], 'ethereum'], env),
      ).toEqual(true)
      expect(
        executeBlip({}, ['=', ['env', 'chainName'], 'arbitrum'], env),
      ).toEqual(false)
    })

    it('sets an object field to an env value', () => {
      expect(
        executeBlip(
          { block: 0 },
          ['set', 'block', ['env', 'blockNumber']],
          env,
        ),
      ).toEqual({ block: 21_000_000 })
    })

    it('compares a copied field against env timestamp (hasExpired pattern)', () => {
      expect(
        executeBlip(1_699_000_000, ['<', ['env', 'timestamp']], env),
      ).toEqual(true)
      expect(
        executeBlip(1_800_000_000, ['<', ['env', 'timestamp']], env),
      ).toEqual(false)
    })

    it('compares address against a discovered field', () => {
      expect(
        executeBlip(
          { owner: '0x1234567890123456789012345678901234567890' },
          ['=', ['env', 'address'], ['get', 'owner']],
          env,
        ),
      ).toEqual(true)
    })
  })

  describe('error handling', () => {
    it('throws on an unknown env key', () => {
      expect(() => executeBlip({}, ['env', 'unknown'], env)).toThrow(
        'Unknown environment key: unknown',
      )
    })

    it('throws when the requested value is missing from env', () => {
      expect(() =>
        executeBlip({}, ['env', 'blockNumber'], { chainName: 'ethereum' }),
      ).toThrow('Environment value not available: blockNumber')
    })

    it('throws when no env is supplied', () => {
      expect(() => executeBlip({}, ['env', 'chainName'])).toThrow(
        'Environment value not available: chainName',
      )
    })
  })

  describe('$-prefixed strings are always literals', () => {
    it('leaves a $-prefixed discovery key such as $admin as a literal', () => {
      expect(executeBlip({}, '$admin', env)).toEqual('$admin')
      expect(executeBlip({}, '$$timestamp', env)).toEqual('$$timestamp')
    })

    it('picks a $-prefixed key from an object', () => {
      expect(executeBlip({ $admin: 1, b: 2 }, ['pick', '$admin'], env)).toEqual(
        {
          $admin: 1,
        },
      )
    })

    it('compares against a $-prefixed literal after to_entries', () => {
      // ['$admin', value] is the shape of an entry produced by to_entries
      expect(
        executeBlip(['$admin', 'x'], ['=', '$admin', ['get', 0]], env),
      ).toEqual(true)
    })
  })
})
