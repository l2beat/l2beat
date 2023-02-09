import { RatingCategory } from '@l2beat/config'
import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
  RatingBadge,
} from '../../components'
import { HorizontalSeparator } from '../../components/HorizontalSeparator'
import { PageContent } from '../../components/PageContent'

export interface DefinitionsPageProps {
  title: string
  footer: FooterProps
  navbar: NavbarProps
}

interface RatingRequirements {
  category: RatingCategory
  name: string
  requirements: ({ main: string; additional: string[] } | string)[]
}

const requirements: RatingRequirements[] = [
  {
    category: 'D',
    name: 'Under construction',
    requirements: [
      'The project should call itself a rollup.',
      'All rollup transactions should go on-chain.',
      'There should exist a “rollup full node”: an independently runnable software package that can read the L1 chain, extract and the rollup chain, and compute the current state of the rollup chain. If it disagrees with a rollup state root posted into the contract, it should give an alarm.',
      'There should be machinery that allows users to either post rollup transactions or at least ensure a withdrawal of their assets with no cooperation from the operator. That is, the operator cannot freeze or steal users’ assets by censoring users; their only possible tool for doing so must be to post a false state root.',
      'It’s okay if the on-chain mechanism for posting new state roots is simply a multisig, with no active fraud proof or validity proof whatsoever.',
    ],
  },
  {
    category: 'B',
    name: 'Limited security',
    requirements: [
      'There must be a running fraud proof or validity proof scheme, which has the practical authority to accept or reject which state roots get accepted by the rollup contract.',
      {
        main: 'There can exist a multisig-based override mechanism (“security council”) that can override the fraud proof or validity proof system’s outputs and post state roots, to be used in case the proof system code is bugged. However:',
        additional: [
          'The multisig must be 6 of 8 or stricter (that is, >= 8 participants AND >= 75% threshold)',
          'At least a quorum-blocking group (that is, enough participants to prevent the multisig from acting) must be outside the organization that is running the rollup.',
        ],
      },
      'There can exist an upgrade mechanism, but if it has a lower threshold than the multisig, upgrades must have a mandatory activation delay of at least 7 days or the maximum length of the fraud proof game, whichever is longer. The goal of this rule is to ensure that the upgrade mechanism cannot be used to intervene in real-time disputes.',
    ],
  },
]

export function DefinitionsPage(props: DefinitionsPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent className="max-w-[840px] pt-16 pb-24 leading-loose">
        <article>
          <h1 className="mt- mb-6 text-center text-4xl font-bold">
            L2BEAT definitions
          </h1>
          <p className="text-center text-gray-850 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel
            faucibus nunc, vulputate placerat nulla. Donec at augue feugiat
            tortor consequat condimentum eget eu lectus.
          </p>
          <HorizontalSeparator className="my-12" />
          <h2 className="mb-12 text-4xl font-bold">
            Ratings – milestones for rollups
          </h2>
          <h3 className="mb-4 text-2xl font-bold">Challenge</h3>

          <p className="mb-10 text-gray-850 dark:text-gray-400">
            There are currently a large number of (optimistic and ZK) rollup
            projects, at various stages of development. One pattern that is
            common to almost all of them is the use of temporary training
            wheels: while a project’s tech is still immature, the project
            launches early anyway to allow the ecosystem to start forming, but
            instead of relying fully on its fraud proofs or ZK proofs, there is
            some kind of multisig that has the ability to force a particular
            outcome in case there are bugs in the code.
          </p>
          <h3 className="mb-4 text-2xl font-bold">
            Solution: A milestone-based schema
          </h3>
          <div className="mb-10 text-gray-850 dark:text-gray-400">
            <p>
              A simple milestone-based schema to help us categorize rollups into
              three different stages, depending on how heavily they rely on
              their training wheels.{' '}
              <strong className="font-medium text-black dark:text-white">
                This is intended to achieve a few goals:
              </strong>
            </p>

            <ol className="mb-4 ml-6 list-decimal  font-medium text-black dark:text-white">
              <li>
                Make it easier for users to identify the extent to which a
                particular rollup depends on “trust in a specific group of
                humans” vs “trust in code”
              </li>
              <li>
                Help motivate rollup projects to improve on their trust models,
                reducing the risk that trust minimization gets deprioritized
                because it is “less visible” than eg. flashy UX improvements
              </li>
              <li>
                Give the ecosystem some precise milestones to coordinate around
                and celebrate, letting us say when “The Surge” is half-complete
                or fully complete, paralleling “The Merge”
              </li>
            </ol>
            <p>
              This schema is NOT intended to imply a moral judgement that
              movement to maximum trust in code as quickly as possible is the
              only correct course of action.{' '}
              <strong className="font-medium text-black dark:text-white">
                Rollups absolutely should have a clear roadmap to taking off
                training wheels, but they should take training wheels off only
                when they are ready.
              </strong>
            </p>
          </div>
          <h3 className="mb-4 text-2xl font-bold">The classification schema</h3>
          {requirements.map((requirement, i) => (
            <React.Fragment key={i}>
              <h4 className="mb-3 mt-10 flex items-center gap-2 text-2xl font-bold">
                <RatingBadge category={requirement.category} />
                {requirement.name}
              </h4>
              <div className="text-gray-850 dark:text-gray-400">
                Requirements:
                <ul className="ml-6 list-disc">
                  {requirement.requirements.map((requirement, i) =>
                    typeof requirement === 'string' ? (
                      <li key={i}>{requirement}</li>
                    ) : (
                      <li key={i}>
                        {requirement.main}
                        <ul className="ml-6 list-disc">
                          {requirement.additional.map((additional, i) => (
                            <li key={i}>{additional}</li>
                          ))}
                        </ul>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </React.Fragment>
          ))}
        </article>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
