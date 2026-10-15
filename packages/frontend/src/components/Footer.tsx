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
          'mx-auto flex max-w-[1216px] flex-col items-center gap-2 text-secondary lg:h-6 lg:flex-row lg:justify-between',
          innerContainerClassName,
        )}
      >
        <p className="text-center font-medium text-xs leading-none">
          Made with 💗 by the L2BEAT team
        </p>
        {/* In the body, because agents that fetch a page skip its <head> links and headers. */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
          <FooterLink href="/llms.txt">llms.txt</FooterLink>
          {markdownHref && (
            <FooterLink href={markdownHref}>
              Markdown version of this page
            </FooterLink>
          )}
        </div>
        <p className="text-center font-medium text-xs leading-none lg:text-right">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <CustomLink
      href={href}
      variant="plain"
      className="font-medium text-secondary text-xs"
    >
      {children}
    </CustomLink>
  )
}
