import React from 'react'

import { config } from '../pages/config'
import { OutLink } from './OutLink'

export function Footer() {
  return (
    <footer className="Footer">
      <p className="Footer-Text">
        Made with ❤️ by the L2BEAT research team. Support us by{' '}
        <a className="text-link underline" href="/donate">
          donating
        </a>
        .
      </p>
      <p className="Footer-Text">
        Copyright {new Date().getFullYear()} L2BEAT.
      </p>
      <ul className="Footer-Links">
        <li className="Footer-Link">
          <OutLink className="text-link underline" href={config.twitterLink}>
            Twitter
          </OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink className="text-link underline" href={config.discordLink}>
            Discord
          </OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink className="text-link underline" href={config.githubLink}>
            Github
          </OutLink>
        </li>
      </ul>
    </footer>
  )
}
