import { CustomLink } from './custom-link'
import { SocialLinks } from './social-links'

export function Footer() {
  return (
    <footer>
      <div className="border-t border-gray-200 xl:h-20 max-xl:py-4 dark:border-gray-850 flex flex-row items-center">
        <div className="max-w-[1216px] mx-auto flex grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12 flex-1">
          <p className="text-center text-sm font-medium md:text-left">
            Made with 💗 by the L2BEAT research team.{' '}
            <br className="hidden lg:inline" />
            Support us by <CustomLink href="/donate">donating</CustomLink>.
          </p>
          <ul className="flex w-full justify-center gap-4">
            <SocialLinks />
          </ul>
          <p className="text-center text-sm font-medium md:text-right">
            Copyright 2024 L2BEAT
          </p>
        </div>
      </div>
    </footer>
  )
}
