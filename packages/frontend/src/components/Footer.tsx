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
      className={cn('px-4 py-6 md:px-12 md:pt-4 md:pb-10 lg:pb-5', className)}
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
        <p className="text-center font-medium text-xs leading-none md:text-right">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}
