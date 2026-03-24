import { expect } from 'earl'
import { toInteropTransaction } from './interopTransaction'

describe('interopTransaction', () => {
  it('does not silently backfill top-level fields from calls', () => {
    const tx = toInteropTransaction({
      type: '0x76',
      calls: [{ to: '0x3', value: 7n, data: '0xbeef' }],
    })

    expect(tx.to).toEqual(undefined)
    expect(tx.value).toEqual(undefined)
    expect(tx.data).toEqual(undefined)
    expect(tx.calls).toEqual([{ to: '0x3', value: 7n, data: '0xbeef' }])
  })

  it('keeps helper methods explicit and deterministic', () => {
    const tx = toInteropTransaction({
      data: '0x1234',
      calls: [
        { data: '0x1234', to: 'A', value: 0n },
        { data: '0x5678', to: 'B', value: 1n },
      ],
    })

    expect(tx.getDataCandidates()).toEqual(['0x1234', '0x5678'])
    expect(
      toInteropTransaction({
        calls: [
          { to: '0xaaa', value: 9n, data: '0xdeadbeef' },
          { to: '0xbbb', value: 0n, data: '0xdeadbeef' },
        ],
      }).getTargetCallValue(['0xaaa']),
    ).toEqual(9n)
  })
})
