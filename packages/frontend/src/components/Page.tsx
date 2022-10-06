import React, { ReactNode } from 'react'

import { Navbar, NavbarProps } from './navbar/Navbar'
import { PageContent } from './PageContent'

export interface PageProps {
  children: ReactNode
  navbar: NavbarProps
  narrow?: boolean
}

export function Page({ children, navbar, narrow }: PageProps) {
  return (
    <>
      <Navbar {...navbar} />
      <PageContent narrow={narrow}>{children}</PageContent>
    </>
  )
}
