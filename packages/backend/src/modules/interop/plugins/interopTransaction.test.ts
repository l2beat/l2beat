import { expect } from 'earl'
import { toInteropTransaction } from './interopTransaction'

describe('interopTransaction', () => {
  it('normalizes call shapes using @l2beat/validate schemas', () => {
    const tx = toInteropTransaction({
      type: '0x76',
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
      type: '0x76',
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
