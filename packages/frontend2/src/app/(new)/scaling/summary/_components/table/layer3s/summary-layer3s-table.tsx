'use client'
import React from 'react'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useTable } from '~/hooks/use-table'
import { columns } from './columns'
import { BasicTable } from '~/app/_components/table/basic-table'
import { type ScalingSummaryLayer3sEntry } from '~/server/features/scaling/types'

interface Props {
  items: ScalingSummaryLayer3sEntry[]
}

export function SummaryLayer3sTable({ items }: Props) {
  const table = useTable({
    data: items,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
    },
  })

  return <BasicTable table={table} />
}
