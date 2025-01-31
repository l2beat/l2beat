import type { ReactNode } from 'react'

export function ChartControlsWrapper({ children }: { children: ReactNode }) {
  return <div className="flex justify-between gap-2 md:gap-4">{children}</div>
}
