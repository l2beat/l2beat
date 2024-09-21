import { CustomLink } from './link/custom-link'
import { SocialLinks } from './social-links'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="flex flex-row items-center border-t border-gray-200 dark:border-gray-850 max-xl:py-4 xl:h-20">
        <div className="mx-auto flex max-w-[1216px] flex-1 grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12">
          <p className="text-center text-sm font-medium md:text-left">
            Made with 💗 by the L2BEAT research team.{' '}
            <br className="hidden lg:inline" />
            Support us by <CustomLink href="/donate">donating</CustomLink>.
          </p>
          <ul className="flex w-full justify-center gap-4">
            <SocialLinks />
          </ul>
          <p className="text-center text-sm font-medium md:text-right">
            Copyright {currentYear} L2BEAT
          </p>
        </div>
      </div>
    </footer>
  )
}
