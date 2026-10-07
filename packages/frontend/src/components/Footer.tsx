import { cn } from '~/utils/cn'
import { CustomLink } from './link/CustomLink'

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
          // Three equal columns keep the middle link centred whatever the side texts' widths.
          'mx-auto flex max-w-[1216px] flex-col items-center gap-2 text-secondary md:grid md:h-6 md:grid-cols-3',
          innerContainerClassName,
        )}
      >
        <p className="text-center font-medium text-xs leading-none md:text-left">
          Made with 💗 by the L2BEAT team
        </p>
        <p className="text-center">
          <CustomLink
            href="/terms-of-service"
            variant="plain"
            className="font-medium text-secondary text-xs"
          >
            Terms of Service
          </CustomLink>
        </p>
        <p className="text-center font-medium text-xs leading-none md:text-right">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}
