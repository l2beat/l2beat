import { cn } from '~/utils/cn'
import { HOME_TEXT } from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeTitleLink } from './HomeCardHeader'

// TODO: point at the mandate once it is published; About Us, with our
// mission, stands in until then.
const MANDATE_HREF = '/about-us'

export function HomeMandateBanner({ className }: { className?: string }) {
  return (
    <HomeCard className={cn('flex flex-col justify-center gap-1', className)}>
      <h2 className={HOME_TEXT.title}>
        <HomeTitleLink href={MANDATE_HREF}>Read our mandate</HomeTitleLink>
      </h2>
      <p className={HOME_TEXT.body}>What L2BEAT stands for and how we work.</p>
    </HomeCard>
  )
}
