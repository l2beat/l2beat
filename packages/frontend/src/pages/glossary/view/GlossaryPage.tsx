import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { FullPageHeader } from '../../../components/FullPageHeader'
import { PageContent } from '../../../components/PageContent'
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
      <FullPageHeader pageContentClassName="">
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
          <div className="mt-8 lg:mt-14">
            <AlphabetSelector entries={props.entries} />
          </div>
        </div>
      </FullPageHeader>
      <PageContent className="mt-12 flex">
        <NavigationList entries={props.entries} />
        <main className="lg:ml-16">
          {props.entries.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}

function GlossaryItem(props: { entry: GlossaryEntry }) {
  return (
    <section className="mt-12 first:mt-0" id={props.entry.id}>
      <a
        href={`#${props.entry.id}`}
        className="mb-4 block text-2xl font-bold text-gray-850 no-underline dark:text-white"
      >
        {props.entry.term}
        {props.entry.isSpicy && ' 🌶️'}
      </a>
      <p className="text-lg text-gray-850 dark:text-white">
        {props.entry.definition}
      </p>
    </section>
  )
}

function NavigationList(props: { entries: GlossaryEntry[] }) {
  return (
    <nav className="custom-scrollbar sticky top-12 hidden max-h-[90vh] w-[1200px] overflow-y-scroll lg:block">
      <ul className="flex flex-col gap-4">
        {props.entries.map((entry) => (
          <li key={entry.id} className="pr-1">
            <a
              href={`#${entry.id}`}
              className="flex gap-1 text-base font-semibold text-gray-850 transition hover:text-pink-900 dark:text-white dark:opacity-80 dark:hover:text-pink-200 dark:hover:opacity-100"
            >
              <span className="line-clamp-1">{entry.term}</span>
              {entry.isSpicy && '🌶️'}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
