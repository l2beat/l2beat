import React from 'react'

type Props = {
  children: React.ReactNode
}

export function BreakdownPageWrapper({ children }: Props) {
  return <div className="mx-auto h-full max-w-[928px]">{children}</div>
}
