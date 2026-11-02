import { expect } from 'earl'
import { keepKnownSortColumns } from './keepKnownSortColumns'

describe(keepKnownSortColumns.name, () => {
  const columnIds = ['#', 'name', 'total']
  const defaultSorting = [{ id: 'total', desc: true }]

  it('returns the same array when every column is known', () => {
    const sorting = [{ id: 'name', desc: false }]

    expect(
      keepKnownSortColumns(sorting, columnIds, defaultSorting),
    ).toExactlyEqual(sorting)
  })

  it('drops unknown columns and keeps the rest', () => {
    const sorting = [
      { id: 'removed', desc: false },
      { id: 'name', desc: true },
    ]

    expect(keepKnownSortColumns(sorting, columnIds, defaultSorting)).toEqual([
      { id: 'name', desc: true },
    ])
  })

  it('falls back to the default when no column is known', () => {
    const sorting = [{ id: 'removed', desc: false }]

    expect(keepKnownSortColumns(sorting, columnIds, defaultSorting)).toEqual(
      defaultSorting,
    )
  })

  it('returns no sort when the default names an unknown column too', () => {
    // useTable's built-in '#' default on a table without a '#' column
    const sorting = [{ id: '#', desc: false }]

    expect(keepKnownSortColumns(sorting, ['name'])).toEqual([])
  })
})
