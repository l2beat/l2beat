import React from 'react'

import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  className?: string
}

export function OurApproachSection({ className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <GovernanceCardHeader>Our Approach</GovernanceCardHeader>
      <p className="mt-6 leading-snug">
        We recognize that achieving successful decentralized governance stands
        as a vital challenge within the blockchain realm. Our goal is to
        actively contribute to governance across the Ethereum ecosystem,
        ensuring that L2 solutions evolve towards a{' '}
        <strong>more secure, decentralized, and trustworthy future</strong>.
      </p>
      <p className="mt-4 leading-snug">
        For us, governance isn't just about casting a vote. The real magic
        happens during{' '}
        <strong>healthy debates and coming to conclusions together</strong>.
        Voting should just be the cherry on top of a great community-driven
        process.
      </p>
      <p className="mt-4 leading-snug">
        As a governance delegate, we hold the following core values:
        <ul className="list-inside list-disc leading-snug">
          <li>
            <strong>Transparency & Open Communication:</strong> We believe in
            being open about our decision-making process and keeping the
            community informed about any proposals or issues we discuss.
          </li>
          <li>
            <strong>Community Focus</strong>: Our top priority is to always
            consider the community's needs and interests in every decision we
            make.
          </li>
          <li>
            <strong>Inclusiveness</strong>: We're committed to fostering a
            diverse and inclusive environment, where everyone's voice is heard,
            regardless of their background or experience.
          </li>
          <li>
            <strong>Accountability</strong>: We value accountability and are
            always open to feedback, which helps us continually improve and
            better serve our community.
          </li>
        </ul>
      </p>
    </GovernanceCard>
  )
}
