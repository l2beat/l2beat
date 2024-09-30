import { notFound } from 'next/navigation'
import { env } from 'process'
import React from 'react'
import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'
import { V2Setter } from './v2-setter'

export default function Layout({ children }: { children: React.ReactNode }) {
  if (env.NODE_ENV !== 'development') {
    return notFound()
  }

  return (
    <NavLayout logoLink="/scaling/summary">
      <V2Setter />
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
