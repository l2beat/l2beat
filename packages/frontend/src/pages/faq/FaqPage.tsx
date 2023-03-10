import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../components'
import { PageContent } from '../../components/PageContent'

export interface FaqPageProps {
  title: string
  content: string
  footer: FooterProps
  navbar: NavbarProps
}

export function FaqPage(props: FaqPageProps) {
  const linkClasses =
    'mt-4 first:mt-0 text-gray-850 hover:text-pink-900 dark:text-white/80 dark:hover:text-pink-200 font-semibold text-base'
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <span className="mt-16 flex flex-col border-b border-gray-850 pb-12">
          <span className="text-4xl font-extrabold">
            Welcome to the L2BEAT FAQ!
          </span>
          <span className="mt-4 text-xl font-semibold">
            Hi! We are glad you've made it here. Below you will find answers to
            most frequently asked questions about L2BEAT.
          </span>
        </span>
        <div className="mt-12 flex flex-row justify-between">
          <aside className="hidden max-w-[288px] md:flex md:flex-col">
            <a
              className={linkClasses}
              href="#what-is-the-overall-purpose-of-this-site"
            >
              What is the overall purpose of this site?
            </a>
            <a
              className={linkClasses}
              href="#why-do-you-need-l2beat-if-you-have-defi-pulse-defi-lama-etc"
            >
              Why do you need L2BEAT if you have DeFi Pulse, DeFi Lama, etc.?
            </a>
            <a
              className={linkClasses}
              href="#what-exactly-are-l2s-and-why-polygon-is-not-included"
            >
              What exactly are L2s and why Polygon is not included?
            </a>
            <a
              className={linkClasses}
              href="#but-isn-t-polygon-a-plasma-rollup-and-sidechain-all-in-one"
            >
              But isn't Polygon a Plasma, Rollup and Sidechain all in one?
            </a>
            <a
              className={linkClasses}
              href="#right-so-how-can-l1-help-with-the-security-of-l2"
            >
              Right, so how can L1 help with the security of L2?
            </a>
            <a
              className={linkClasses}
              href="#can-you-explain-how-l1-can-help-with-l2-state-validation"
            >
              Can you explain how L1 can help with L2 state validation?
            </a>
            <a
              className={linkClasses}
              href="#what-if-l2-validators-submit-a-fraudulent-state-commit-to-l1"
            >
              What if L2 validators submit a fraudulent state commit to L1?
            </a>
            <a
              className={linkClasses}
              href="#are-there-any-other-ways-l2-validators-can-steal-user-s-coins"
            >
              Are there any other ways L2 validators can steal user's coins?
            </a>
            <a
              className={linkClasses}
              href="#what-about-data-availability-why-is-it-important"
            >
              What about data availability? Why is it important?
            </a>
            <a className={linkClasses} href="#categories">
              Ok, so what are the main categories of L2s?
            </a>
            <a
              className={linkClasses}
              href="#how-exactly-do-you-calculate-metrics-like-tvl"
            >
              How exactly do you calculate metrics like TVL?
            </a>
            <a
              className={linkClasses}
              href="#apart-from-tvl-what-is-l2beat-aiming-to-track"
            >
              Apart from TVL, what is L2BEAT aiming to track?
            </a>
            <a
              className={linkClasses}
              href="#is-l2beat-performing-a-security-audit-for-each-l2"
            >
              Is L2BEAT performing a security audit for each L2?
            </a>
            <a
              className={linkClasses}
              href="#why-aren-t-state-channel-based-solutions-like-raiden-or-nahmii-included"
            >
              Why aren't state channel based solutions like Raiden or Nahmii
              included?
            </a>
            <a
              className={linkClasses}
              href="#how-can-i-add-a-new-project-or-improve-some-info"
            >
              How can I add a new project or improve some info?
            </a>
          </aside>
          <article
            className="Faq"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
