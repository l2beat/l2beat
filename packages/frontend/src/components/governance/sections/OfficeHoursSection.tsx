import React from 'react'

import { Button } from '../../Button'
import { OutLink } from '../../OutLink'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'
import { OfficeHoursIllustration } from '../OfficeHoursIllustration'

interface Props {
  className?: string
}

export function OfficeHoursSection({ className }: Props) {
  console.log('xd')
  return (
    <GovernanceCard as="section" mobileFull type="purple" className={className}>
      <GovernanceCardHeader>Office Hours</GovernanceCardHeader>
      <p className="mt-4 text-balance text-base font-medium ">
        To promote transparency and communication as delegates, we’re hosting
        recurring Office Hours on Google Meets.
      </p>
      <OfficeHoursIllustration className="mt-4 w-full" />
      <p className="mt-4 text-sm">
        During the Office Hours, anyone is able to reach L2BEAT’s governance
        team, which consists of <span className="underline">Kaereste</span>{' '}
        (Krzysztof Urbanski) and <span className="underline">Sinkas</span>{' '}
        (Anastassis Oikonomopoulos) and discuss our activity as delegates.
      </p>
      <p className="mt-4 text-sm">
        To allow enough time for constructive discussion, each Office Hours call
        will be specifically targeted at one of the protocols we’re delegates
        in.
      </p>
      <OutLink href="https://calendar.google.com/calendar/u/0?cid=Y18wNzQ1ODJiMWJkNWE2NTVjOGNkMmQ2YjNhYjliZDQ0NzcxY2U3MDgyYzI2Zjk0MmQ1MzM5ZWUxZDllN2M4YzA0QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20">
        <Button className="mt-6 h-14 w-full">
          Add the L2BEAT GOV Calendar
        </Button>
      </OutLink>
    </GovernanceCard>
  )
}
