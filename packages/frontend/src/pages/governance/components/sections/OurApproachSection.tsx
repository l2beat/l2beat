import { cn } from '~/utils/cn'
import { GovernanceCard } from '../GovernanceCard'

interface Props {
  className?: string
}

export function OurApproachSection({ className }: Props) {
  return (
    <GovernanceCard mobileFull className={cn(className, 'h-min')}>
      <div className="text-heading-24 md:text-heading-32">Our approach</div>
      <p className="mt-6 text-paragraph-16 md:text-paragraph-15">
        We recognize that achieving successful decentralized governance stands
        as a vital challenge within the blockchain realm. Our goal is to
        actively contribute to governance across the Ethereum ecosystem,
        ensuring that L2 solutions evolve towards a{' '}
        <strong>more secure, decentralized, and trustworthy future</strong>.
      </p>
      <p className="mt-4 text-paragraph-16 md:text-paragraph-15">
        For us, governance isn&apos;t just about casting a vote. The real magic
        happens during{' '}
        <strong>healthy debates and coming to conclusions together</strong>.
        Voting should just be the cherry on top of a great community-driven
        process.
      </p>
      <div className="mt-4 text-paragraph-16 md:text-paragraph-15">
        As a governance delegate, we hold the following core values:
        <ul className="mt-2 ml-6 list-disc text-paragraph-16 md:text-paragraph-15">
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
