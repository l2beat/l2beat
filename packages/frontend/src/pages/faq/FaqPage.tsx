import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../components'
import { HorizontalSeparator } from '../../components/HorizontalSeparator'
import { PageContent } from '../../components/PageContent'
import { FaqItem } from './faqItems'

export interface FaqPageProps {
  title: string
  items: FaqItem[]
  footer: FooterProps
  navbar: NavbarProps
}

export function FaqPage(props: FaqPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <div className="mt-16">
          <div className="mb-4 text-4xl font-extrabold">
            Welcome to the L2BEAT FAQ!
          </div>
          <div className="text-xl font-semibold">
            Hi! We are glad you've made it here. Below you will find answers to
            most frequently asked questions about L2BEAT.
          </div>
          <HorizontalSeparator className="mt-12 mb-4" />
        </div>
        <div className="flex">
          <div className="mt-12 hidden w-72 flex-shrink-0 flex-col gap-4 lg:flex">
            {props.items.map((item) => (
              <a
                key={questionToId(item.question)}
                href={`#${questionToId(item.question)}`}
                className="text-base font-semibold text-gray-850 transition hover:text-pink-900 dark:text-white dark:opacity-80 dark:hover:text-pink-200 dark:hover:opacity-100"
              >
                {item.question}
              </a>
            ))}
          </div>
          <article className="lg:ml-16">
            {props.items.map((item) => (
              <section
                className="mt-12"
                id={questionToId(item.question)}
                key={questionToId(item.question)}
              >
                <a
                  href={`#${questionToId(item.question)}`}
                  className="mb-4 block text-2xl font-bold text-gray-850 no-underline dark:text-white"
                >
                  {item.question}
                </a>
                <span className="text-lg text-gray-850 dark:text-white">
                  {item.answer}
                </span>
              </section>
            ))}
          </article>
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}

function questionToId(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // remove leading and trailing hyphens
}
