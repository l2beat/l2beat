import React, { ReactNode } from 'react'

import { Navbar } from './navbar/Navbar'

export interface PageProps {
  children: ReactNode
}

export function Page({ children }: PageProps) {
  return (
    <>
      <Navbar />
      <div className="max-w-[1000px] h-full px-4 mx-auto leading-[1.15]">
        {children}
      </div>
    </>
  )
}
