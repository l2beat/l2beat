import { expect } from 'earl'
import { CALLDATA_BYTES_MAX } from '../link'
import { INITIAL_STATE, reducer } from './state'

describe(reducer.name, () => {
  it('rejects data that a link cannot carry', () => {
    const data = `0x${'00'.repeat(CALLDATA_BYTES_MAX + 1)}`

    const state = reducer(INITIAL_STATE, { type: 'set data', value: data })

    expect(state.errors.data).toEqual('Data is longer than 64 KiB')
  })

  it('accepts data at the limit', () => {
    const data = `0x${'00'.repeat(CALLDATA_BYTES_MAX)}`

    const state = reducer(INITIAL_STATE, { type: 'set data', value: data })

    expect(state.errors.data).toEqual(undefined)
  })
})
