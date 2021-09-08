import React from 'react'

import { config } from '../config'
import { OutLink } from './OutLink'

export function Footer() {
  return (
    <footer className="Footer">
      <p className="Footer-Text">Made with ❤️ by the L2BEAT research team.</p>
      <p className="Footer-Text">
        Copyright {new Date().getFullYear()} L2BEAT.
      </p>
      <ul className="Footer-Links">
        <li className="Footer-Link">
          <OutLink href={config.twitterLink}>Twitter</OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink href={config.discordLink}>Discord</OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink href={config.githubLink}>Github</OutLink>
        </li>
      </ul>
    </footer>
  )
}
