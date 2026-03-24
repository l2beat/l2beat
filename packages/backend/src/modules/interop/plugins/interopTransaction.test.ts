import { expect } from 'earl'
import {
  INTEROP_BUNDLE_TX_TYPE,
  toInteropTransaction,
} from './interopTransaction'

describe('interopTransaction', () => {
  it('classifies transactions in a declarative way', () => {
    const canonical = toInteropTransaction({
      data: '0x1234',
      value: 1n,
      type: '2',
    })
    const bundle = toInteropTransaction({
      type: INTEROP_BUNDLE_TX_TYPE,
      calls: [{ input: '0xabcd' }],
    })
    const unknown = toInteropTransaction({ type: INTEROP_BUNDLE_TX_TYPE })

    expect(canonical.kind).toEqual('canonical')
    expect(bundle.kind).toEqual('bundle')
    expect(unknown.kind).toEqual('unknown')
  })

  it('normalizes call shapes using @l2beat/validate schemas', () => {
    const tx = toInteropTransaction({
      type: INTEROP_BUNDLE_TX_TYPE,
      calls: [
        { to: '0x1', value: 5n, input: '0xabcd' },
        { to: '0x2', data: '0xdead' },
        { random: 'field' },
        { to: 1 },
      ],
    })

    expect(tx.calls).toEqual([
      { to: '0x1', value: 5n, data: '0xabcd' },
      { to: '0x2', value: undefined, data: '0xdead' },
    ])
  })

  it('does not silently backfill top-level fields from calls', () => {
    const tx = toInteropTransaction({
      type: INTEROP_BUNDLE_TX_TYPE,
      calls: [{ to: '0x3', value: 7n, input: '0xbeef' }],
    })

    expect(tx.to).toEqual(undefined)
    expect(tx.value).toEqual(undefined)
    expect(tx.data).toEqual(undefined)
    expect(tx.calls).toEqual([{ to: '0x3', value: 7n, data: '0xbeef' }])
  })

  it('keeps helper methods explicit and deterministic', () => {
    const tx = toInteropTransaction({
      data: '0x1234',
      calls: [{ data: '0x1234' }, { data: '0x5678' }],
    })

    expect(tx.getDataCandidates()).toEqual(['0x1234', '0x5678'])
    expect(
      toInteropTransaction({
        calls: [
          { to: '0xaaa', value: 9n },
          { to: '0xbbb', value: 0n },
        ],
      }).getTargetCallValue(['0xaaa']),
    ).toEqual(9n)
  })
})
