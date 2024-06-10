import React from 'react'

import { HorizontalSeparator } from '../../components/HorizontalSeparator'
import { PageContent } from '../../components/PageContent'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { FaqItem } from './getFaqItems'

export interface FaqPageProps {
  title: string
  items: FaqItem[]
}

export function FaqPage(props: FaqPageProps) {
  return (
    <DashboardLayout>
      <PageContent>
        <div className="mt-16">
          <div className="mb-4 font-extrabold text-4xl">
            Welcome to the L2BEAT FAQ!
          </div>
          <div className="font-semibold text-xl">
            Hi! We are glad you've made it here. Below you will find answers to
            most frequently asked questions about L2BEAT.
          </div>
          <HorizontalSeparator className="mt-12 mb-4" />
        </div>
        <div className="flex">
          <div className="mt-12 hidden w-72 shrink-0 flex-col gap-4 lg:flex">
            {props.items.map((item) => (
              <a
                key={questionToId(item.question)}
                href={`#${questionToId(item.question)}`}
                className="font-semibold text-base text-gray-850 transition dark:hover:text-pink-200 dark:text-white hover:text-pink-900 dark:hover:opacity-100 dark:opacity-80"
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
                  className="mb-4 block font-bold text-2xl text-gray-850 no-underline dark:text-white"
                >
                  {item.question}
                </a>
                <span className="text-gray-850 text-lg dark:text-white">
                  {item.answer}
                </span>
              </section>
            ))}
          </article>
        </div>
      </PageContent>
    </DashboardLayout>
  )
}

function questionToId(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // remove leading and trailing hyphens
}
