import { expect } from 'earl'
import {
  getBasicTableBodyCellClassName,
  getBasicTableHeaderCellClassName,
} from './classNames'

describe('classNames', () => {
  describe(getBasicTableHeaderCellClassName.name, () => {
    it('starts a non-sortable first label where its values start', () => {
      const base = {
        groupParams: undefined,
        isPinned: false,
        headClassName: undefined,
      }
      expect(
        getBasicTableHeaderCellClassName({ ...base, isSortable: false }),
      ).toEqual('first:pl-3')
      expect(
        getBasicTableHeaderCellClassName({ ...base, isSortable: true }),
      ).toEqual('')
      expect(
        getBasicTableHeaderCellClassName({
          ...base,
          isSortable: false,
          align: 'right',
        }),
      ).toEqual('')
    })
  })

  describe(getBasicTableBodyCellClassName.name, () => {
    it('uses sortable left spacing branch only when left aligned', () => {
      const leftAlignedClassName = getBasicTableBodyCellClassName({
        groupParams: {
          headerTitle: 'group',
          isFirstInGroup: true,
          isLastInGroup: false,
        },
        isSortable: true,
        align: undefined,
        isPinned: false,
        rowBackgroundColor: undefined,
        isHighlighted: false,
        cellClassName: undefined,
      })

      const rightAlignedClassName = getBasicTableBodyCellClassName({
        groupParams: {
          headerTitle: 'group',
          isFirstInGroup: true,
          isLastInGroup: false,
        },
        isSortable: true,
        align: 'right',
        isPinned: false,
        rowBackgroundColor: undefined,
        isHighlighted: false,
        cellClassName: undefined,
      })

      expect(leftAlignedClassName.includes('pl-10')).toEqual(true)
      // The group inset must not override the sort-icon indent
      expect(leftAlignedClassName.includes('pl-6')).toEqual(false)
      expect(rightAlignedClassName.includes('pl-10')).toEqual(false)
      expect(rightAlignedClassName.includes('pl-4')).toEqual(false)
    })

    it('adds highlight class only for pinned highlighted cells', () => {
      const highlightedPinnedClassName = getBasicTableBodyCellClassName({
        groupParams: undefined,
        isSortable: false,
        align: undefined,
        isPinned: true,
        rowBackgroundColor: 'blue',
        isHighlighted: true,
        cellClassName: undefined,
      })
      const nonPinnedClassName = getBasicTableBodyCellClassName({
        groupParams: undefined,
        isSortable: false,
        align: undefined,
        isPinned: false,
        rowBackgroundColor: 'blue',
        isHighlighted: true,
        cellClassName: undefined,
      })

      expect(
        highlightedPinnedClassName.includes('animate-row-highlight-no-opacity'),
      ).toEqual(true)
      expect(
        nonPinnedClassName.includes('animate-row-highlight-no-opacity'),
      ).toEqual(false)
    })
  })
})
