import React from 'react'

import { TechnologySection as TechnologySectionComponent } from './TechnologySection'

export default {
  title: 'Components/Project/TechnologySection',
}

export function TechnologySection() {
  return (
    <div className="p-4 leading-normal">
      <TechnologySectionComponent
        id="technology"
        title="Technology"
        items={[
          {
            id: 'foo',
            name: 'Some aspect of technology',
            description:
              'Ultimately, Optimism will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
            risks: [
              {
                isCritical: true,
                text: 'Funds can be stolen if an invalid state root is submitted to the system.',
              },
            ],
            references: [
              {
                text: 'Introducing EVM Equivalence',
                href: '#',
              },
            ],
            isIncomplete: false,
            isUnderReview: false,
          },
          {
            id: 'bar',
            name: 'Other considerations',
            description:
              "Sometimes I truly don't know what do I want to write inside descriptions like these.",
            risks: [],
            references: [],
            isIncomplete: true,
            isUnderReview: false,
          },
          {
            id: 'bar',
            name: 'Other considerations',
            description: 'Sometimes the section is under review',
            risks: [],
            references: [],
            isIncomplete: false,
            isUnderReview: true,
          },
        ]}
      />
    </div>
  )
}
