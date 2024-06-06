import React from 'react'
import { Link } from './Link'
import { SocialLinks } from './navbar/SocialLinks'
export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mt-20 border-t border-gray-200 py-4 min-h-[81px] dark:border-gray-850">
        <div className="m-auto flex grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12">
          <p className="text-center text-sm font-medium md:text-left">
            Made with 💗 by the L2BEAT research team.{' '}
            <br className="hidden lg:inline" />
            Support us by <Link href="/donate">donating</Link>.
          </p>
          <ul className="flex w-full justify-center gap-4">
            <SocialLinks />
          </ul>
          <p className="text-center text-sm font-medium md:text-right">
            Copyright {new Date().getFullYear()} L2BEAT
          </p>
        </div>
      </div>
    </footer>
  )
}
