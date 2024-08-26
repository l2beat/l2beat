import React from 'react'

type Props = {
  children: React.ReactNode
}

export function BreakdownPageWrapper({ children }: Props) {
  return (
    <div className={'mx-auto h-full max-w-[928px] px-4 md:px-12'}>
      {children}
    </div>
  )
}
