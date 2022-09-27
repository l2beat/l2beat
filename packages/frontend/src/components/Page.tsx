import React, { ReactNode } from 'react'

import { Navbar, NavbarProps } from './navbar/Navbar'
import { PageContent } from './PageContent'

export interface PageProps {
  children: ReactNode
  navbar: NavbarProps
}

export function Page({ children, navbar }: PageProps) {
  return (
    <>
      <Navbar {...navbar} />
      <PageContent>{children}</PageContent>
    </>
  )
}
