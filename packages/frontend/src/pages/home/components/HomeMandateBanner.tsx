import { cn } from '~/utils/cn'
import { HOME_TEXT } from '../homeStyles'
import { HomeTitleLink } from './HomeCardHeader'

// TODO: point at the mandate once it is published; About Us, with our
// mission, stands in until then.
const MANDATE_HREF = '/about-us'

/** A small banner beside CROPS, framed like it but without the scenery. */
export function HomeMandateBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-1 border-divider border-y p-4 md:rounded-lg md:border-x md:px-6 md:py-5',
        className,
      )}
    >
      <h2 className={HOME_TEXT.title}>
        <HomeTitleLink href={MANDATE_HREF}>Read our mandate</HomeTitleLink>
      </h2>
      <p className={HOME_TEXT.body}>What L2BEAT stands for and how we work.</p>
    </div>
  )
}
