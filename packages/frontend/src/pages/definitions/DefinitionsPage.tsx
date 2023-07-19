import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../components'
import { MultisigReportAnnouncementBar } from '../../components/announcement/AnnouncementBar'
import { FloatingBanner } from '../../components/floating-banner/FloatingBanner'
import { HorizontalSeparator } from '../../components/HorizontalSeparator'
import { PageContent } from '../../components/PageContent'

export interface DefinitionsPageProps {
  title: string
  htmlContent: string
  footer: FooterProps
  navbar: NavbarProps
  showMultisigReport: boolean
}

export function DefinitionsPage(props: DefinitionsPageProps) {
  return (
    <>
      {props.showMultisigReport && (
        <>
          <MultisigReportAnnouncementBar />
          <FloatingBanner />
        </>
      )}
      <Navbar {...props.navbar} />
      <PageContent className="max-w-[840px] pt-16 pb-24 leading-loose">
        <h1 className="mt- mb-6 text-center text-4xl font-bold">
          L2BEAT definitions
        </h1>
        <p className="text-center text-gray-850 dark:text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel
          faucibus nunc, vulputate placerat nulla. Donec at augue feugiat tortor
          consequat condimentum eget eu lectus.
        </p>
        <HorizontalSeparator className="my-12" />
        <article
          className="definitions"
          dangerouslySetInnerHTML={{ __html: props.htmlContent }}
        />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
