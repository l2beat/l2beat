import type React from 'react'
import { CssVariables } from '~/components/CssVariables'

interface StatCardProps {
  color?: string
  children: React.ReactNode
}

export function StatCard({ color, children }: StatCardProps) {
  if (!color) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-divider px-2 py-3 lg:px-4 lg:py-5">
        {children}
      </div>
    )
  }

  return (
    <CssVariables variables={{ 'stat-color': color }}>
      <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--stat-color)] bg-[var(--stat-color)]/10 px-2 py-3 lg:px-4 lg:py-5">
        {children}
      </div>
    </CssVariables>
  )
}
