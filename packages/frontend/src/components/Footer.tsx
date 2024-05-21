import React from 'react'

import { cn } from '../utils/cn'
import { Link } from './Link'
import { SocialLinks } from './navbar/SocialLinks'
import { usePageBuildContext } from './navbar/navigationContext'
export function Footer() {
  const { config } = usePageBuildContext()
  return (
    <footer className="mt-auto">
      <div
        className={cn(
          'mt-20 border-t border-gray-200 py-8 dark:border-gray-850',
        )}
      >
        <div
          className={cn(
            'mx-auto flex grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12',
          )}
        >
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
