import { cn } from '~/utils/cn'
import { HOME_TEXT } from '../homeStyles'
import { HomeTitleLink } from './HomeCardHeader'

// TODO: point at the mandate once it is published; About Us, with our
// mission, stands in until then.
const MANDATE_HREF = '/about-us'

/**
 * From lg a small banner beside CROPS, framed like it but without the
 * scenery; below lg, where CROPS opens the menu instead, a plain section.
 */
export function HomeMandateBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-1 border-divider border-t px-(--home-gutter) py-5 lg:rounded-lg lg:border lg:px-6',
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
