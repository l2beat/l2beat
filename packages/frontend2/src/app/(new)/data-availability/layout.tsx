import React from 'react'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { Footer } from '~/app/_components/footer'
import { NavLayout } from '~/app/_components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/data-availability">
      <div className="min-h-screen">
        <ContentWrapper className="mt-16">{children}</ContentWrapper>
      </div>
      <Footer />
    </NavLayout>
  )
}
