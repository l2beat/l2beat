import React, { ReactNode } from 'react'

import { cn } from '../../../../utils/cn'

interface Props {
  children: ReactNode
  className?: string
}

export function FinancialCell({ children, className }: Props) {
  return <span className={cn('FinancialCell', className)}>{children}</span>
}
