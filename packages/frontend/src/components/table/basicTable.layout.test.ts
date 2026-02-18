import { expect } from 'earl'
import {
  getBasicTableBodyCellClassName,
  getBasicTableGroupedHeaderCellClassName,
  getBasicTableHeaderCellClassName,
} from './basicTable.layout'

describe('basicTable.layout', () => {
  describe(getBasicTableGroupedHeaderCellClassName.name, () => {
    it('adds grouped header spacing only when header exists and is not placeholder', () => {
      const visibleGroupClassName = getBasicTableGroupedHeaderCellClassName({
        isPlaceholder: false,
        hasHeader: true,
        isPinned: false,
      })
      const placeholderClassName = getBasicTableGroupedHeaderCellClassName({
        isPlaceholder: true,
        hasHeader: false,
        isPinned: false,
      })

      expect(visibleGroupClassName.includes('rounded-t-lg')).toEqual(true)
      expect(visibleGroupClassName.includes('px-6')).toEqual(true)
      expect(visibleGroupClassName.includes('pt-4')).toEqual(true)

      expect(placeholderClassName.includes('rounded-t-lg')).toEqual(false)
      expect(placeholderClassName.includes('px-6')).toEqual(false)
      expect(placeholderClassName.includes('pt-4')).toEqual(false)
    })
  })

  describe(getBasicTableHeaderCellClassName.name, () => {
    it('adds rounded corners only when group has no header title', () => {
      const noTitleClassName = getBasicTableHeaderCellClassName({
        groupParams: {
          headerTitle: undefined,
          isFirstInGroup: true,
          isLastInGroup: true,
        },
        isPinned: false,
        headClassName: undefined,
      })

      const titledClassName = getBasicTableHeaderCellClassName({
        groupParams: {
          headerTitle: 'Group',
          isFirstInGroup: true,
          isLastInGroup: true,
        },
        isPinned: false,
        headClassName: undefined,
      })

      expect(noTitleClassName.includes('rounded-tl-lg')).toEqual(true)
      expect(noTitleClassName.includes('rounded-tr-lg')).toEqual(true)
      expect(titledClassName.includes('rounded-tl-lg')).toEqual(false)
      expect(titledClassName.includes('rounded-tr-lg')).toEqual(false)
    })

    it('keeps custom head class', () => {
      const className = getBasicTableHeaderCellClassName({
        groupParams: {
          headerTitle: undefined,
          isFirstInGroup: false,
          isLastInGroup: false,
        },
        isPinned: false,
        headClassName: 'custom-head-class',
      })

      expect(className.includes('custom-head-class')).toEqual(true)
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

    it('keeps custom cell class', () => {
      const className = getBasicTableBodyCellClassName({
        groupParams: undefined,
        isSortable: false,
        align: undefined,
        isPinned: false,
        rowBackgroundColor: undefined,
        isHighlighted: false,
        cellClassName: 'custom-cell-class',
      })

      expect(className.includes('custom-cell-class')).toEqual(true)
    })
  })
})
