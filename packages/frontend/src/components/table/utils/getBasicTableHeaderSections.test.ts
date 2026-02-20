import type { HeaderGroup } from '@tanstack/react-table'
import { expect } from 'earl'
import { getBasicTableHeaderSections } from './getBasicTableHeaderSections'

describe(getBasicTableHeaderSections.name, () => {
  it('returns only actual header for one-level headers', () => {
    const header = { id: 'h0' } as HeaderGroup<unknown>

    const result = getBasicTableHeaderSections([header])

    expect(result.groupedHeader).toEqual(undefined)
    expect(result.actualHeader).toEqual(header)
  })

  it('returns grouped and actual headers for two-level headers', () => {
    const groupedHeader = { id: 'h0' } as HeaderGroup<unknown>
    const actualHeader = { id: 'h1' } as HeaderGroup<unknown>

    const result = getBasicTableHeaderSections([groupedHeader, actualHeader])

    expect(result.groupedHeader).toEqual(groupedHeader)
    expect(result.actualHeader).toEqual(actualHeader)
  })

  it('throws for more than one grouping level', () => {
    const headerGroups = [
      { id: 'h0' },
      { id: 'h1' },
      { id: 'h2' },
    ] as HeaderGroup<unknown>[]

    expect(() => getBasicTableHeaderSections(headerGroups)).toThrow(
      'Only 1 level of headers is supported',
    )
  })
})
