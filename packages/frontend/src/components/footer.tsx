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
        'border-divider border-t px-4 pb-6 pt-4 md:border-t-0 md:px-12 md:pb-10 dark:border-zinc-700',
        className,
      )}
    >
      <div
        className={cn(
          'text-secondary mx-auto flex max-w-[1216px] flex-col items-center gap-2 md:h-6 md:flex-row md:justify-between',
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
            className="text-secondary text-xs font-medium"
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
