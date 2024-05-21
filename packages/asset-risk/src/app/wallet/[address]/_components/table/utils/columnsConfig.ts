import { ReactNode } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { Token } from '../TokensTable'

export type SortingRule = 'alphabetical' | 'numeric'

export type Sorting = {
  rule: SortingRule
  getOrderValue: (value: Token, index: number) => string | number | undefined
}

export interface SingleColumnConfig {
  name: string
  tooltip?: ReactNode
  className?: ClassNameValue
  sorting?: Sorting
}

export const columnsConfig: SingleColumnConfig[] = [
  {
    name: 'VALUE',
    sorting: {
      rule: 'numeric',
      getOrderValue: ({ balance }) => Number(balance),
    },
  },
  {
    name: 'NAME',
    className: 'pl-12',
    sorting: {
      rule: 'alphabetical',
      getOrderValue: ({ token }) => token.name,
    },
  },
  {
    name: 'TYPE',
  },
  {
    name: '',
  },
] as const
