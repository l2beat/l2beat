import { externalLinks } from '~/consts/externalLinks'
import { cn } from '~/utils/cn'
import { CustomLink } from './link/CustomLink'

/** About L2BEAT and its resources; the side nav keeps to the sections. */
const FOOTER_LINKS = [
  { title: 'About Us', href: '/about-us' },
  { title: 'Changelog', href: '/changelog' },
  { title: 'Native Rollups', href: '/native-rollups' },
  { title: 'Forum', href: externalLinks.forum },
  { title: 'Tools', href: externalLinks.tools },
  { title: 'Glossary', href: '/glossary' },
  { title: 'Brand Kit', href: '/brand-kit' },
  { title: 'Terms of Service', href: '/terms-of-service' },
]

interface Props {
  className?: string
  innerContainerClassName?: string
}

export function Footer({ className, innerContainerClassName }: Props) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'px-4 py-6 md:px-12 md:pt-4 md:pb-10 lg:pb-5',
        // Matches the mobile root background, so bottom overscroll continues the footer.
        'max-lg:border-divider max-lg:border-t max-lg:bg-header-primary',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1216px] flex-col items-start gap-3 text-secondary md:min-h-6 md:flex-row md:flex-wrap md:items-center md:gap-x-8',
          innerContainerClassName,
        )}
      >
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <CustomLink
              key={link.title}
              href={link.href}
              variant="plain"
              className="font-medium text-secondary text-xs"
            >
              {link.title}
            </CustomLink>
          ))}
        </nav>
        <p className="font-medium text-xs leading-none">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}
