import React from 'react'

import { Link } from './Link'

export function About() {
  return (
    <section className="mt-8 text-base">
      <h2
        id="about"
        className="text-2xl font-bold md:text-3xl md:leading-normal"
      >
        <a href="#about">About L2BEAT</a>
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p>
            L2BEAT is an analytics and research website about Ethereum layer two
            (L2) scaling. We provide a comparison of the various Ethereum L2
            systems available today.
          </p>
          <p>
            An important differentiator between L2BEAT and similar sites is that
            L2BEAT is committed to educating users and lists only projects that
            match our narrow definition of L2. We define layer two as a chain
            that fully or partially derives its security from layer one Ethereum
            so that users do not have to rely on the honesty of L2 validators
            for the security of their funds.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p>
            Because of our commitment to education we present various
            non-trivial metrics aside from Total Value Locked (TVL). We have
            carefully examined each L2 project to determine the inner workings
            of their technology as well as the associated risks. To learn about
            any of our listed projects visit their respective page on L2BEAT.
          </p>
          <p>
            We have also compiled a list of{' '}
            <Link href="/faq">Frequently Asked Questions</Link> that will help
            explain some of the decisions we made for our site. We hope you find
            L2BEAT a valuable resource.
          </p>
        </div>
      </div>
    </section>
  )
}
