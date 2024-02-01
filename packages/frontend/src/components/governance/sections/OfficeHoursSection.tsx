import React from 'react'

import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'
import { OfficeHoursIllustration } from '../OfficeHoursIllustration'

interface Props {
  className?: string
}

export function OfficeHoursSection({ className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull type="purple" className={className}>
      <GovernanceCardHeader>Office Hours</GovernanceCardHeader>
      <p className="mt-4 text-balance font-medium leading-normal">
        To promote transparency and communication as delegates, we’re hosting
        recurring Office Hours on Google Meets.
      </p>
      <OfficeHoursIllustration className="mt-4 w-full" />
      <p className="mt-4 leading-snug">
        During the Office Hours, anyone is able to reach L2BEAT’s governance
        team, which consists of <span className="underline">Kaereste</span>{' '}
        (Krzysztof Urbanski) and <span className="underline">Sinkas</span>{' '}
        (Anastassis Oikonomopoulos) and discuss our activity as delegates.
      </p>
      <p className="mt-4 leading-snug">
        To allow enough time for constructive discussion, each Office Hours call
        will be specifically targeted at one of the protocols we’re delegates
        in.
      </p>
      <div className="mt-6 w-full rounded-lg bg-white py-3.5 text-center text-lg font-bold text-black">
        Add the L2BEAT GOV Calendar
      </div>
    </GovernanceCard>
  )
}
