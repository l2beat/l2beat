import { externalLinks } from '~/consts/externalLinks'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { getMarkdownAlternatePath } from '~/utils/getMarkdownAlternatePath'
import { CustomLink } from './link/CustomLink'

const FOOTER_LINKS = [
  { title: 'About Us', href: '/about-us' },
  { title: 'Brand Kit', href: '/brand-kit' },
  { title: 'Changelog', href: '/changelog' },
  { title: 'Donate', href: '/donate' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Forum', href: externalLinks.forum },
  { title: 'Glossary', href: '/glossary' },
  { title: 'Native Rollups', href: '/native-rollups' },
  { title: 'Publications', href: '/publications' },
  { title: 'Terms of Service', href: '/terms-of-service' },
  { title: 'Tools', href: externalLinks.tools },
]

interface Props {
  className?: string
  /** The page's content column, so the footer's edges line up with it. */
  columnClassName?: string
  /** False for a page the markdown registry would wrongly give a `.md`. */
  hasMarkdown?: boolean
}

export function Footer({
  className,
  columnClassName,
  hasMarkdown = true,
}: Props) {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const markdownHref = hasMarkdown
    ? getMarkdownAlternatePath(pathname)
    : undefined

  return (
    <footer
      className={cn(
        // From lg the bottom row centres on the sidebar's social icons.
        'py-8 lg:pb-5',
        // Matches the mobile root background, so bottom overscroll continues the footer.
        'max-lg:border-divider max-lg:border-t max-lg:bg-header-primary',
        className,
      )}
    >
      <div
        className={cn(
          '@container flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 font-medium text-secondary text-xs',
          columnClassName,
        )}
      >
        {/*
          The links span the column, as a grid while they would wrap. The
          copyright joins their row at a fixed width, with room to spare,
          instead of wrapping wherever the text runs out.
        */}
        <nav className="-my-1 @4xl:my-0 @4xl:flex grid @min-[73rem]:w-auto w-full @xl:grid-cols-[repeat(6,auto)] grid-cols-[repeat(3,auto)] @min-[73rem]:justify-start justify-between gap-x-4">
          {FOOTER_LINKS.map((link) => (
            <CustomLink
              key={link.title}
              href={link.href}
              variant="plain"
              underline={false}
              className="@4xl:py-0 py-1 text-secondary leading-6 underline-offset-2 hover:text-primary hover:underline"
            >
              {link.title}
            </CustomLink>
          ))}
        </nav>
        {/* For agents, which follow only links in the page body: they skip <head> links and headers. */}
        <ul className="sr-only">
          <li>
            <a href="/llms.txt" tabIndex={-1}>
              llms.txt
            </a>
          </li>
          {markdownHref && (
            <li>
              <a href={markdownHref} tabIndex={-1}>
                Markdown version of this page
              </a>
            </li>
          )}
        </ul>
        <p className="font-normal leading-6">
          Copyright {currentYear} ETHBEAT (
          <CustomLink
            href={RENAME_ANNOUNCEMENT_PATH}
            variant="plain"
            underline={false}
            className="font-normal text-secondary underline-offset-2 hover:text-primary hover:underline"
          >
            formerly L2BEAT
          </CustomLink>
          )
        </p>
      </div>
    </footer>
  )
}
