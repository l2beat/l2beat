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
    <footer className="py-8 mt-20 border-t border-gray-200 dark:border-gray-850">
      <div
        className={cx(
          props.narrow ? 'max-w-[1064px]' : 'max-w-[1216px]',
          'px-4 md:px-12 mx-auto flex flex-col gap-4 md:grid grid-cols-3',
        )}
      >
        <p className="font-medium text-sm text-center md:text-left">
          Made with ❤️ by the L2BEAT research team.{' '}
          <br className="hidden lg:inline" />
          Support us by{' '}
          <a className="text-link underline" href="/donate">
            donating
          </a>
          .
        </p>
        <ul className="flex gap-4 w-full justify-center">
          <SocialLinks {...props} />
        </ul>
        <p className="font-medium text-sm text-center md:text-right">
          Copyright {new Date().getFullYear()} L2BEAT
        </p>
      </div>
    </footer>
  )
}
