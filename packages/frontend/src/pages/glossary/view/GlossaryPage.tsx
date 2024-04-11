import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { FullPageHeader } from '../../../components/FullPageHeader'
import { PageContent } from '../../../components/PageContent'
import { ScrollToTopButton } from '../../../components/ScrollToTopButton'
import { GlossaryEntry } from '../props/getGlossaryEntry'
import { AlphabetSelector } from './AlphabetSelector'
import { GlossaryItem } from './GlossaryItem'
import { GlossarySideNavigation } from './GlossarySideNavigation'

export interface GlossaryPageProps {
  entries: GlossaryEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GlossaryPage(props: GlossaryPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <FullPageHeader className="pb-0">
        <div className="w-full">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold">Glossary</h1>
            <div className="w-full text-lg lg:w-2/3">
              <p className="font-medium">
                Explore the L2BEAT Glossary, your comprehensive resource for
                understanding the terms and concepts of the L2 ecosystem. Find
                here all essential definitions and insights.
              </p>{' '}
              <p className="font-light">
                Designed for everyone from developers to enthusiasts, this
                resource simplifies the complexities of L2, helping you navigate
                Ethereum's advanced landscape with ease.
              </p>
            </div>
          </div>
        </div>
      </FullPageHeader>
      <FullPageHeader
        className="sticky top-0 py-8 lg:pt-14"
        pageContentClassName="block"
        as="div"
      >
        <AlphabetSelector entries={props.entries} />
      </FullPageHeader>
      <PageContent className="mt-12 flex">
        <GlossarySideNavigation entries={props.entries} />
        <main className="lg:ml-16">
          {props.entries.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </main>
      </PageContent>
      <ScrollToTopButton desktopThreshold={325} mobileThreshold={525} />
      <Footer {...props.footer} />
    </>
  )
}
