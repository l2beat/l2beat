import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { FullPageHeader } from '../../../components/FullPageHeader'
import { ChiliIcon } from '../../../components/icons/symbols/ChiliIcon'
import { PageContent } from '../../../components/PageContent'
import { ScrollToTopButton } from '../../../components/ScrollToTopButton'
import { GlossaryEntry } from '../props/getGlossaryEntry'
import { AlphabetSelector } from './AlphabetSelector'

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
        <NavigationList entries={props.entries} />
        <main className="lg:ml-16">
          {props.entries.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </main>
      </PageContent>
      <ScrollToTopButton />
      <Footer {...props.footer} />
    </>
  )
}

function GlossaryItem(props: { entry: GlossaryEntry }) {
  return (
    <section className="mt-12 first:mt-0" id={props.entry.id}>
      <a
        href={`#${props.entry.id}`}
        className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-850 no-underline dark:text-white"
      >
        {props.entry.term}
        {props.entry.isSpicy && <ChiliIcon className="size-6 shrink-0" />}
      </a>
      <p className="text-lg text-gray-850 dark:text-white">
        {props.entry.definition}
      </p>
    </section>
  )
}

function NavigationList(props: { entries: GlossaryEntry[] }) {
  return (
    <nav
      data-role="glossary-nav-list"
      className="sticky top-[145px] hidden max-h-[70vh] w-[246px] min-w-[246px] lg:block"
    >
      <div className="relative h-full">
        <ul className="flex h-full flex-col gap-4 overflow-y-scroll pb-8 pr-6">
          {props.entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                data-role="glossary-nav-item"
                className='flex items-center gap-1 text-xs font-medium text-gray-850 transition-colors hover:text-pink-900 data-[selected="true"]:text-[#C164E3] dark:text-white dark:opacity-80 dark:hover:text-pink-200 dark:hover:opacity-100 dark:data-[selected="true"]:text-[#C164E3]'
              >
                <span className="line-clamp-1">{entry.term}</span>
                {entry.isSpicy && <ChiliIcon className="shrink-0" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white via-white dark:from-neutral-900 dark:via-neutral-900" />
      </div>
    </nav>
  )
}
