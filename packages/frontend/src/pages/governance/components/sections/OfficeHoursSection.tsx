import { Button } from '~/components/core/Button'
import { PlainLink } from '~/components/PlainLink'
import { OfficeHoursIllustration } from '../../assets/OfficeHoursIllustration'
import { GovernanceCard } from '../GovernanceCard'

export function OfficeHoursSection() {
  return (
    <GovernanceCard
      mobileFull
      type="purple"
      className="flex flex-col justify-between lg:col-span-3"
    >
      <div className="flex flex-col gap-4">
        <div className="text-heading-24 md:text-heading-32">Office hours</div>
        <p className="text-balance font-bold text-paragraph-16">
          To promote transparency and communication as delegates, we&apos;re
          hosting recurring Office Hours on Google Meets.
        </p>
        <OfficeHoursIllustration className="w-full" />
        <p className="text-paragraph-15">
          During the Office Hours, anyone is able to reach L2BEAT&apos;s
          governance team, which consists of{' '}
          <span className="underline">Kaereste</span> (Krzysztof Urbanski),{' '}
          <span className="underline">Sinkas</span> (Anastassis Oikonomopoulos)
          and <span className="underline">Manugotsuka</span> (Manuel Gonzalez)
          and discuss our activity as delegates.
        </p>
        <p className="text-paragraph-15">
          To allow enough time for constructive discussion, each Office Hours
          call will be specifically targeted at one of the protocols we&apos;re
          delegates in.
        </p>
      </div>
      <Button className="mx-auto mt-6 h-14 w-full md:w-1/2 lg:w-full" asChild>
        <PlainLink href="https://calendar.google.com/calendar/u/0?cid=Y18wNzQ1ODJiMWJkNWE2NTVjOGNkMmQ2YjNhYjliZDQ0NzcxY2U3MDgyYzI2Zjk0MmQ1MzM5ZWUxZDllN2M4YzA0QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20">
          Add the L2BEAT GOV Calendar
        </PlainLink>
      </Button>
    </GovernanceCard>
  )
}
