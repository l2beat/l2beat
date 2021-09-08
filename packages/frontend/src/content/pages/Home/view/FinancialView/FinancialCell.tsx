import cx from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function FinancialCell({ children, className }: Props) {
  return <span className={cx('FinancialCell', className)}>{children}</span>
}
