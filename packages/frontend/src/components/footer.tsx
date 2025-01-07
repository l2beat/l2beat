import { CustomLink } from './link/custom-link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-divider px-4 pb-6 pt-4 sidebar:px-4 dark:border-zinc-700 md:border-t-0 md:px-12 md:pb-10 sidebar:md:px-12 sidebar:md:pt-8 sidebar:lg:pl-6 sidebar:lg:pr-9">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-2 text-secondary sidebar:max-w-[1142px] md:h-6 md:flex-row md:justify-between">
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
