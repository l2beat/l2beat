import { expect } from 'earl'
import { CALLDATA_BYTES_MAX } from '../link'
import { INITIAL_STATE, normalizeData, reducer } from './state'

describe(reducer.name, () => {
  it('rejects data that a link cannot carry', () => {
    const data = `0x${'00'.repeat(CALLDATA_BYTES_MAX + 1)}`

    const state = reducer(INITIAL_STATE, { type: 'set data', value: data })

    expect(state.errors.data).toEqual('Data is longer than 64 KiB')
  })

  it('accepts data without 0x and with whitespace like the old decoder', () => {
    const state = reducer(INITIAL_STATE, {
      type: 'set data',
      value: 'A9059CBB 0000\n1111\t2222',
    })

    expect(state.errors.data).toEqual(undefined)
    expect(normalizeData(state.values.data)).toEqual('0xa9059cbb000011112222')
  })

  it('accepts data at the limit', () => {
    const data = `0x${'00'.repeat(CALLDATA_BYTES_MAX)}`

    const state = reducer(INITIAL_STATE, { type: 'set data', value: data })

    expect(state.errors.data).toEqual(undefined)
  })
})
