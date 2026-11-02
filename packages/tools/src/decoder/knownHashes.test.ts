import { expect } from 'earl'
import { findKnownHashes, type KnownHash } from './knownHashes'

const entry: KnownHash = {
  id: 'second-safe',
  hash: '0x853896d548772f2fd70fdea4da6fe3b9597d12fbad422684e3afae2763974390',
  address: '0x6d5b183f538abb8572f5cd17109c617b994d5833',
  chainId: 1,
  nonce: '10',
  path: 'transaction.calls[1].callData',
  anchor: 'second-safe-call',
}

describe('known hash references', () => {
  it('matches hash bytes without relying on an argument name', () => {
    expect(findKnownHashes([entry], entry.hash, 1)).toEqual([entry])
    expect(
      findKnownHashes([entry], `0x${entry.hash.slice(2).toUpperCase()}`, 1),
    ).toEqual([entry])
  })

  it('does not match prefixes, other hashes, or another chain', () => {
    expect(findKnownHashes([entry], '0x853896d5', 1)).toEqual([])
    expect(findKnownHashes([entry], `0x${'00'.repeat(32)}`, 1)).toEqual([])
    expect(findKnownHashes([entry], entry.hash, 10)).toEqual([])
    expect(findKnownHashes([entry], entry.hash, undefined)).toEqual([])
  })

  it('keeps duplicate transaction occurrences distinguishable', () => {
    const duplicate = {
      ...entry,
      id: 'third-safe',
      path: 'transaction.calls[2].callData',
      anchor: 'third-safe-call',
    }
    expect(findKnownHashes([entry, duplicate], entry.hash, 1)).toEqual([
      entry,
      duplicate,
    ])
  })

  it('only resolves currently registered hashes after a nonce change or removal', () => {
    const updated = {
      ...entry,
      nonce: '11',
      hash: `0x${'12'.repeat(32)}` as const,
    }
    expect(findKnownHashes([updated], entry.hash, 1)).toEqual([])
    expect(findKnownHashes([updated], updated.hash, 1)).toEqual([updated])
    expect(findKnownHashes([], entry.hash, 1)).toEqual([])
  })
})
