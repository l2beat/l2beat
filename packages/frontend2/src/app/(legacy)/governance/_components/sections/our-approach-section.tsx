import React from 'react'

import { cn } from '~/utils/cn'
import { GovernanceCard, GovernanceCardHeader } from '../governance-card'

interface Props {
  className?: string
}

export function OurApproachSection({ className }: Props) {
  return (
    <GovernanceCard mobileFull className={cn(className, 'h-min')}>
      <GovernanceCardHeader>Our approach</GovernanceCardHeader>
      <p className="mt-6 text-base md:text-sm">
        We recognize that achieving successful decentralized governance stands
        as a vital challenge within the blockchain realm. Our goal is to
        actively contribute to governance across the Ethereum ecosystem,
        ensuring that L2 solutions evolve towards a{' '}
        <strong>more secure, decentralized, and trustworthy future</strong>.
      </p>
      <p className="mt-4 text-base md:text-sm">
        For us, governance isn&apos;t just about casting a vote. The real magic
        happens during{' '}
        <strong>healthy debates and coming to conclusions together</strong>.
        Voting should just be the cherry on top of a great community-driven
        process.
      </p>
      <div className="mt-4 text-base md:text-sm">
        As a governance delegate, we hold the following core values:
        <ul className="ml-6 mt-2 list-disc text-base md:text-sm">
          <li>
            <strong>Transparency & Open Communication:</strong> We believe in
            being open about our decision-making process and keeping the
            community informed about any proposals or issues we discuss.
          </li>
          <li>
            <strong>Community Focus</strong>: Our top priority is to always
            consider the community&apos;s needs and interests in every decision
            we make.
          </li>
          <li>
            <strong>Inclusiveness</strong>: We&apos;re committed to fostering a
            diverse and inclusive environment, where everyone&apos;s voice is
            heard, regardless of their background or experience.
          </li>
          <li>
            <strong>Accountability</strong>: We value accountability and are
            always open to feedback, which helps us continually improve and
            better serve our community.
          </li>
        </ul>
      </div>
    </GovernanceCard>
  )
}
