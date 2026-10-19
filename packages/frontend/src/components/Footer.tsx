import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { getMarkdownAlternatePath } from '~/utils/getMarkdownAlternatePath'
import { CustomLink } from './link/CustomLink'

interface Props {
  className?: string
  innerContainerClassName?: string
}

export function Footer({ className, innerContainerClassName }: Props) {
  const currentYear = new Date().getFullYear()
  const markdownHref = getMarkdownAlternatePath(usePathname())

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
          'mx-auto flex max-w-[1216px] flex-col items-center gap-2 text-secondary md:h-6 md:flex-row md:justify-between',
          innerContainerClassName,
        )}
      >
        <p className="text-center font-medium text-xs leading-none">
          Made with 💗 by the L2BEAT team
        </p>
        <p>
          <CustomLink
            href="/terms-of-service"
            variant="plain"
            className="font-medium text-secondary text-xs"
          >
            Terms of Service
          </CustomLink>
        </p>
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
        <p className="text-center font-medium text-xs leading-none md:text-right">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}
