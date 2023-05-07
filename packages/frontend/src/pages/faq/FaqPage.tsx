import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../components'
import { HorizontalSeparator } from '../../components/HorizontalSeparator'
import { PageContent } from '../../components/PageContent'

export interface FaqPageProps {
  title: string
  content: string
  footer: FooterProps
  navbar: NavbarProps
}

interface FaqItem {
  id: string
  question: string
}

export function FaqPage(props: FaqPageProps) {
  const faqItems = contentToFaqItems(props.content)

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
        <div className="grid grid-cols-4 gap-x-28">
          <div className="col-span-1 mt-8 hidden w-72 md:block">
            <div className="sticky top-8 flex-shrink-0 flex-col gap-4 lg:flex">
              {faqItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-base font-semibold text-gray-850 transition hover:text-pink-900 dark:text-white dark:opacity-80 dark:hover:text-pink-200 dark:hover:opacity-100"
                >
                  {item.question}
                </a>
              ))}
            </div>
          </div>
          <article
            className="Faq col-span-full lg:col-span-3"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}

function contentToFaqItems(content: string) {
  const h2Regex = new RegExp('<h2 id="([^"]+)"><a[^>]+>(.+)</a></h2>', 'g')
  const items = content.matchAll(h2Regex)
  const faqItems: FaqItem[] = []
  for (const item of items) {
    faqItems.push({ id: item[1], question: item[2] })
  }
  return faqItems
}
