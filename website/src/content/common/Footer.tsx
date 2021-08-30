import React from 'react'

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
          <OutLink href="https://twitter.com/l2beatcom">Twitter</OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink href="https://github.com/l2beat/l2beat">Github</OutLink>
        </li>
      </ul>
    </footer>
  )
}
