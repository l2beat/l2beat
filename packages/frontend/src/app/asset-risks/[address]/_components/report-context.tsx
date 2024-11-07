'use client'

import { createContext, useContext } from 'react'
import { type Address } from 'viem'
import { type RouterOutputs, api } from '~/trpc/react'

const ReportContext = createContext<
  (RouterOutputs['assetRisks']['report'] & { address: Address }) | null
>(null)

export function ReportProvider({
  address,
  children,
  placeholder,
}: {
  address: Address
  children: React.ReactNode
  placeholder?: React.ReactNode
}) {
  const query = api.assetRisks.report.useQuery({ address })

  if (!query.data) return placeholder ?? null

  return (
    <ReportContext.Provider value={{ ...query.data, address }}>
      {children}
    </ReportContext.Provider>
  )
}

export function useReport() {
  const context = useContext(ReportContext)
  if (!context)
    throw new Error('useReport must be used within a ReportProvider')
  return context
}

type Report = ReturnType<typeof useReport>
export type Token = Report['tokens'][number]
