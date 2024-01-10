import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { z } from 'zod'

import { ProjectSectionId } from '../project/sectionId'

export interface RowConfig<T> {
  getProps: (
    value: T,
    index: number,
  ) => HTMLAttributes<HTMLTableRowElement> &
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
}
export interface GroupedColumnConfig<T> {
  type: 'group'
  columns: SingleColumnConfig<T>[]
  title?: React.ReactNode
}
export interface SingleColumnConfig<T> {
  name: string
  icon?: ReactNode
  shortName?: ReactNode
  align?: 'center' | 'right'
  minimalWidth?: true
  headClassName?: string
  className?: string
  noPaddingRight?: true
  idHref?: ProjectSectionId
  getValue: (value: T, index: number) => ReactNode
  tooltip?: string
  sorting?: SortingConfig<T>
}
export type ColumnConfig<T> =
  | (SingleColumnConfig<T> & { type?: never })
  | GroupedColumnConfig<T>

export type SortingConfig<T> = {
  defaultState?: SortingState
  rule: SortingRule
} & (
  | {
      getOrderValue: (value: T, index: number) => string | number | undefined
      defaultOrderKey?: never
    }
  | {
      getOrderValue: (
        value: T,
        index: number,
      ) => Record<string, string | number | undefined>
      defaultOrderKey: string
    }
)

export const SortingOrderValue = z
  .union([
    z.string(),
    z.number(),
    z.record(z.union([z.string(), z.number(), z.undefined()])),
  ])
  .optional()
export type SortingOrderValue = z.infer<typeof SortingOrderValue>

export type SortingRule = 'alphabetical' | 'numeric'
export type SortingState = 'asc' | 'desc'
