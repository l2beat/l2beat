import { expect } from 'earl'
import {
  getBasicTableBodyCellClassName,
  getBasicTableColumnFillerClassName,
  getBasicTableGroupedHeaderCellClassName,
  getBasicTableHeaderCellClassName,
  getTableBleedWrapperClassName,
  getTableElementClassName,
  getTableScrollWrapperClassName,
} from './basicTable.layout'
import {
  getPinningLayerZIndex,
  type PinningLayerRole,
} from './utils/commonPinningStyles'

describe('basicTable.layout', () => {
  describe(getTableBleedWrapperClassName.name, () => {
    it('returns existing bleed layout class', () => {
      expect(getTableBleedWrapperClassName()).toEqual('max-md:-mr-4')
    })
  })

  describe(getTableScrollWrapperClassName.name, () => {
    it('keeps baseline scroll wrapper classes and horizontal overflow', () => {
      const className = getTableScrollWrapperClassName()

      expect(className.includes('relative')).toEqual(true)
      expect(className.includes('w-full')).toEqual(true)
      expect(className.includes('overflow-x-auto')).toEqual(true)
      expect(className.includes('pb-3')).toEqual(true)
      expect(className.includes('max-md:pr-4')).toEqual(true)
      expect(className.includes('overflow-auto')).toEqual(false)
    })

    it('merges custom wrapper classes for compact table variants', () => {
      const className = getTableScrollWrapperClassName('pb-0')

      expect(className.includes('pb-0')).toEqual(true)
      expect(className.includes('pb-3')).toEqual(false)
      expect(className.includes('overflow-x-auto')).toEqual(true)
    })
  })

  describe(getTableElementClassName.name, () => {
    it('keeps baseline table classes and merges custom classes', () => {
      const className = getTableElementClassName('text-right')

      expect(className.includes('w-full')).toEqual(true)
      expect(className.includes('border-collapse')).toEqual(true)
      expect(className.includes('text-right')).toEqual(true)
    })
  })

  describe(getBasicTableGroupedHeaderCellClassName.name, () => {
    it('adds grouped header cell styles for non-placeholder headers', () => {
      const className = getBasicTableGroupedHeaderCellClassName({
        isPlaceholder: false,
        hasHeader: true,
        isPinned: false,
      })

      expect(className.includes('font-medium')).toEqual(true)
      expect(className.includes('rounded-t-lg')).toEqual(true)
      expect(className.includes('px-6')).toEqual(true)
      expect(className.includes('pt-4')).toEqual(true)
    })
  })

  describe(getBasicTableHeaderCellClassName.name, () => {
    it('keeps grouped edge rounding and spacing with custom class names', () => {
      const className = getBasicTableHeaderCellClassName({
        groupParams: {
          headerTitle: undefined,
          isFirstInGroup: true,
          isLastInGroup: true,
        },
        isPinned: false,
        headClassName: 'custom-head-class',
      })

      expect(className.includes('pl-6')).toEqual(true)
      expect(className.includes('pr-6')).toEqual(true)
      expect(className.includes('rounded-tl-lg')).toEqual(true)
      expect(className.includes('rounded-tr-lg')).toEqual(true)
      expect(className.includes('custom-head-class')).toEqual(true)
    })
  })

  describe(getBasicTableBodyCellClassName.name, () => {
    it('keeps body cell spacing, pinning highlight, and custom class tokens', () => {
      const className = getBasicTableBodyCellClassName({
        groupParams: {
          headerTitle: 'group',
          isFirstInGroup: true,
          isLastInGroup: false,
        },
        isSortable: true,
        align: undefined,
        isPinned: true,
        rowBackgroundColor: 'blue',
        isHighlighted: true,
        cellClassName: 'custom-cell-class',
      })

      expect(className.includes('pl-6!')).toEqual(true)
      expect(className.includes('pl-10')).toEqual(true)
      expect(className.includes('animate-row-highlight-no-opacity')).toEqual(
        true,
      )
      expect(className.includes('custom-cell-class')).toEqual(true)
    })
  })

  describe(getBasicTableColumnFillerClassName.name, () => {
    it('returns filler spacing class contract', () => {
      expect(getBasicTableColumnFillerClassName()).toEqual('h-full w-4 min-w-4')
    })
  })

  describe(getPinningLayerZIndex.name, () => {
    it('maps all pinning roles to current z-index', () => {
      const roles: PinningLayerRole[] = [
        'body',
        'header-main',
        'header-group',
        'footer-filler',
      ]

      expect(roles.map((role) => getPinningLayerZIndex(role))).toEqual([
        1, 1, 1, 1,
      ])
    })
  })
})
