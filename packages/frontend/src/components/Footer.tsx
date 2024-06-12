import React from 'react'
import { Link } from './Link'
import { SocialLinks } from './navbar/SocialLinks'
export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mt-20 min-h-[81px] border-gray-200 border-t py-4 dark:border-gray-850">
        <div className="m-auto flex grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12">
          <p className="text-center font-medium text-sm md:text-left">
            Made with 💗 by the L2BEAT research team.{' '}
            <br className="hidden lg:inline" />
            Support us by <Link href="/donate">donating</Link>.
          </p>
          <ul className="flex w-full justify-center gap-4">
            <SocialLinks />
          </ul>
          <p className="text-center font-medium text-sm md:text-right">
            Copyright {new Date().getFullYear()} L2BEAT
          </p>
        </div>
      </div>
    </footer>
  )
}
