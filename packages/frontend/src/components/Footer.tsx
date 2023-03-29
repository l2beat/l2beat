import cx from 'classnames'
import React from 'react'

import { Config } from '../build/config'
import {
  getSocialLinksProps,
  SocialLinks,
  SocialLinksProps,
} from './navbar/SocialLinks'

export interface FooterProps extends SocialLinksProps {
  narrow?: boolean
}

export function getFooterProps(config: Config): FooterProps {
  return getSocialLinksProps(config)
}

export function Footer(props: FooterProps) {
  return (
    <footer className="mt-20 border-t border-gray-200 py-8 dark:border-gray-850">
      <div
        className={cx(
          props.narrow ? 'max-w-[1064px]' : 'max-w-[1216px]',
          'mx-auto flex grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12',
        )}
      >
        <p className="text-center text-sm font-medium md:text-left">
          Made with 💗 by the L2BEAT research team.{' '}
          <br className="hidden lg:inline" />
          Support us by{' '}
          <a className="text-link underline" href="/donate">
            donating
          </a>
          .
        </p>
        <ul className="flex w-full justify-center gap-4">
          <SocialLinks {...props} />
        </ul>
        <p className="text-center text-sm font-medium md:text-right">
          Copyright {new Date().getFullYear()} L2BEAT
        </p>
      </div>
    </footer>
  )
}
