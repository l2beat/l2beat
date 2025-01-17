import { cn } from '~/utils/cn'
import { CustomLink } from './link/custom-link'

interface Props {
  className?: string
  innerContainerClassName?: string
}

export function Footer({ className, innerContainerClassName }: Props) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'border-t border-divider px-4 pb-6 pt-4 dark:border-zinc-700 md:border-t-0 md:px-12 md:pb-10',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1216px] flex-col items-center gap-2 text-secondary md:h-6 md:flex-row md:justify-between',
          innerContainerClassName,
        )}
      >
        <p className="text-center text-xs font-medium leading-none">
          Made with 💗 by the L2BEAT team
        </p>
        <p>
          <CustomLink
            href="/terms-of-service"
            variant="plain"
            className="text-xs font-medium text-secondary"
          >
            Terms of Service
          </CustomLink>
        </p>
        <p className="text-center text-xs font-medium leading-none md:text-right">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}
