import React from 'react'
import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/scaling/summary" className="v2">
      <div className="min-h-screen">
        <Banner />
        <div className="mx-auto mb-20 max-w-[1648px] md:px-6 xl:pl-0 xl:pr-6 2xl:pr-0">
          {children}
        </div>
      </div>
      <Footer />
    </NavLayout>
  )
}
