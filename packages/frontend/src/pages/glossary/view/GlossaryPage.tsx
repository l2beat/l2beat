import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { FullPageHeader } from '../../../components/FullPageHeader'
import { PageContent } from '../../../components/PageContent'
import { GlossaryEntry } from '../props/getGlossaryEntry'

export interface GlossaryPageProps {
  entries: GlossaryEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GlossaryPage(props: GlossaryPageProps) {
  console.log('x:', props.entries)
  return (
    <>
      <Navbar {...props.navbar} />
      <FullPageHeader pageContentClassName="flex-col items-start">
        <h1 className="text-3xl font-bold">Glossary</h1>
        <p className="mt-4">
          This is a glossary of terms used in the context of the project.
        </p>
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
    <nav className="sticky top-12 hidden max-h-[90vh] w-[1200px] overflow-y-scroll lg:block">
      <ul className="flex flex-col gap-4">
        {props.entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="text-base font-semibold text-gray-850 transition hover:text-pink-900 dark:text-white dark:opacity-80 dark:hover:text-pink-200 dark:hover:opacity-100"
            >
              {entry.term}
              {entry.isSpicy && ' 🌶️'}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
