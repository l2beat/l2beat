import { expect } from 'earl'

import type { BlipEnv } from '../../blip/type'
import type { StructureContract } from '../config/StructureConfig'
import { decodeHandlerResults } from './decodeHandlerResults'
import type { HandlerResult } from './Handler'

describe(decodeHandlerResults.name, () => {
  const longChain = 'ethereum'
  const emptyFieldOverrides = {}
  const emptyTypes = {}
  it('returns empty values and errors', () => {
    expect(
      decodeHandlerResults(longChain, [], emptyFieldOverrides, emptyTypes),
    ).toEqual({
      values: {},
      errors: {},
      usedTypes: [],
    })
  })

  it('returns values and errors', () => {
    expect(
      decodeHandlerResults(
        longChain,
        [
          { field: 'a', value: 1 },
          { field: 'b', value: 2 },
          { field: 'c', value: 3 },
          { field: 'd', error: 'Error 1' },
          { field: 'e', error: 'Error 2' },
        ],
        emptyFieldOverrides,
        emptyTypes,
      ),
    ).toEqual({
      values: {
        a: 1,
        b: 2,
        c: 3,
      },
      errors: {
        d: 'Error 1',
        e: 'Error 2',
      },
      usedTypes: [],
    })
  })

  it('returns only errors', () => {
    expect(
      decodeHandlerResults(
        longChain,
        [
          { field: 'd', error: 'Error 1' },
          { field: 'e', error: 'Error 2' },
        ],
        emptyFieldOverrides,
        emptyTypes,
      ),
    ).toEqual({
      values: {},
      errors: {
        d: 'Error 1',
        e: 'Error 2',
      },
      usedTypes: [],
    })
  })

  it('returns only values', () => {
    expect(
      decodeHandlerResults(
        longChain,
        [
          { field: 'a', value: 1 },
          { field: 'b', value: 2 },
          { field: 'c', value: 3 },
        ],
        emptyFieldOverrides,
        emptyTypes,
      ),
    ).toEqual({
      values: {
        a: 1,
        b: 2,
        c: 3,
      },
      errors: {},
      usedTypes: [],
    })
  })

  describe('context variables in edit expressions', () => {
    const env: BlipEnv = {
      blockNumber: 21_000_000,
      timestamp: 1_700_000_000,
      chainName: 'ethereum',
      address: '0x1234567890123456789012345678901234567890',
    }

    it('resolves $$blockNumber inside an edit', () => {
      const results: HandlerResult[] = [{ field: 'foo', value: { block: 0 } }]
      const fieldOverrides: StructureContract['fields'] = {
        foo: { edit: ['set', 'block', '$$blockNumber'] },
      }

      const { values } = decodeHandlerResults(
        longChain,
        results,
        fieldOverrides,
        emptyTypes,
        env,
      )

      expect(values?.foo).toEqual({ block: 21_000_000 })
    })

    it('resolves $$chainName inside an edit', () => {
      const results: HandlerResult[] = [{ field: 'foo', value: { chain: '' } }]
      const fieldOverrides: StructureContract['fields'] = {
        foo: { edit: ['set', 'chain', '$$chainName'] },
      }

      const { values } = decodeHandlerResults(
        longChain,
        results,
        fieldOverrides,
        emptyTypes,
        env,
      )

      expect(values?.foo).toEqual({ chain: 'ethereum' })
    })

    it('derives hasExpired by copying a field and comparing to $$timestamp', () => {
      const results: HandlerResult[] = [
        { field: 'referralExpirationTime', value: 1_000 },
      ]
      const expiredEnv: BlipEnv = { timestamp: 2_000 }
      const notExpiredEnv: BlipEnv = { timestamp: 500 }
      const fieldOverrides: StructureContract['fields'] = {
        hasExpired: {
          copy: 'referralExpirationTime',
          edit: ['<', '$$timestamp'],
        },
      }

      const expired = decodeHandlerResults(
        longChain,
        results,
        fieldOverrides,
        emptyTypes,
        expiredEnv,
      )
      expect(expired.values?.hasExpired).toEqual(true)

      const notExpired = decodeHandlerResults(
        longChain,
        results,
        fieldOverrides,
        emptyTypes,
        notExpiredEnv,
      )
      expect(notExpired.values?.hasExpired).toEqual(false)
    })
  })
})
