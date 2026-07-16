import { expect } from 'earl'
import { executeBlip } from './executeBlip'
import type { BlipEnv } from './type'

describe('BLIP context variables ($$ / $)', () => {
  const env: BlipEnv = {
    blockNumber: 21_000_000,
    timestamp: 1_700_000_000,
    chainName: 'ethereum',
    address: '0x1234567890123456789012345678901234567890',
  }

  describe('resolution of leaf tokens', () => {
    it('resolves $$blockNumber to the env block number', () => {
      expect(executeBlip({}, '$$blockNumber', env)).toEqual(21_000_000)
    })

    it('resolves $$timestamp to the env timestamp', () => {
      expect(executeBlip({}, '$$timestamp', env)).toEqual(1_700_000_000)
    })

    it('resolves $$chainName to the env chain name', () => {
      expect(executeBlip({}, '$$chainName', env)).toEqual('ethereum')
    })

    it('resolves $address to the env contract address', () => {
      expect(executeBlip({}, '$address', env)).toEqual(
        '0x1234567890123456789012345678901234567890',
      )
    })
  })

  describe('use inside operations', () => {
    it('compares a context variable against a literal', () => {
      expect(executeBlip({}, ['=', '$$chainName', 'ethereum'], env)).toEqual(
        true,
      )
      expect(executeBlip({}, ['=', '$$chainName', 'arbitrum'], env)).toEqual(
        false,
      )
    })

    it('sets an object field to a context variable', () => {
      expect(
        executeBlip(
          { block: 0, chain: '' },
          ['set', 'block', '$$blockNumber'],
          env,
        ),
      ).toEqual({ block: 21_000_000, chain: '' })
    })

    it('threads context variables through a pipe', () => {
      expect(
        executeBlip(
          { deployedAt: 21_000_000 },
          ['pipe', ['get', 'deployedAt'], ['=', '$$blockNumber']],
          env,
        ),
      ).toEqual(true)
    })

    it('resolves context variables the same way for every mapped element', () => {
      expect(executeBlip([{}, {}, {}], ['map', '$$chainName'], env)).toEqual([
        'ethereum',
        'ethereum',
        'ethereum',
      ])
    })

    it('compares $address against a discovered field', () => {
      expect(
        executeBlip(
          { owner: '0x1234567890123456789012345678901234567890' },
          ['=', '$address', ['get', 'owner']],
          env,
        ),
      ).toEqual(true)
    })
  })

  describe('non-interference with existing behavior', () => {
    it('leaves ordinary strings untouched', () => {
      expect(executeBlip({}, 'ethereum', env)).toEqual('ethereum')
      expect(executeBlip({}, 'blockNumber', env)).toEqual('blockNumber')
    })

    it('still extracts #columns from the input value', () => {
      expect(executeBlip({ name: 'weth' }, '#name', env)).toEqual('weth')
    })

    it('works with no env supplied for expressions without context tokens', () => {
      expect(executeBlip({ a: 1 }, ['get', 'a'])).toEqual(1)
    })
  })

  describe('error handling', () => {
    it('throws when a required context variable is missing from env', () => {
      expect(() =>
        executeBlip({}, '$$blockNumber', { chainName: 'ethereum' }),
      ).toThrow()
    })

    it('throws when no env is provided but a context token is used', () => {
      expect(() => executeBlip({}, '$$chainName')).toThrow()
    })
  })

  describe('unknown $-prefixed strings stay literal', () => {
    it('leaves an unknown $$ token as a literal string', () => {
      expect(executeBlip({}, '$$unknown', env)).toEqual('$$unknown')
    })

    it('leaves an unknown $ token as a literal string', () => {
      expect(executeBlip({}, '$unknown', env)).toEqual('$unknown')
    })

    it('does not resolve wrong-tier tokens, keeping them literal', () => {
      // address lives under the single-dollar (contract) tier, not $$
      expect(executeBlip({}, '$$address', env)).toEqual('$$address')
      // chainName lives under the double-dollar (chain) tier, not $
      expect(executeBlip({}, '$chainName', env)).toEqual('$chainName')
    })

    it('keeps a $-prefixed discovery key such as $admin as a literal', () => {
      expect(executeBlip({}, '$admin', env)).toEqual('$admin')
    })

    it('picks a $-prefixed key from an object', () => {
      expect(executeBlip({ $admin: 1, b: 2 }, ['pick', '$admin'], env)).toEqual(
        { $admin: 1 },
      )
    })

    it('compares against a $-prefixed literal after to_entries', () => {
      // ['$admin', value] is the shape of an entry produced by to_entries
      expect(
        executeBlip(['$admin', 'x'], ['=', '$admin', ['get', 0]], env),
      ).toEqual(true)
    })

    it('still resolves known tokens alongside $-prefixed literals', () => {
      expect(executeBlip({}, ['=', '$$chainName', 'ethereum'], env)).toEqual(
        true,
      )
    })
  })
})
