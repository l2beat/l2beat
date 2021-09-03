import React from 'react'

import { config } from '../config'
import { GithubIcon, MoonIcon, SunIcon, TwitterIcon } from './icons'
import { Logo } from './Logo'
import { OutLink } from './OutLink'

export function Navbar() {
  return (
    <nav className="Navbar">
      <a href="/">
        <Logo className="Navbar-Logo" />
      </a>
      <ul className="Navbar-Links left">
        <li className="Navbar-Link">
          <a href="/">Overview</a>
        </li>
        {config.__DEV__showTechnologiesPage && (
          <li className="Navbar-Link">
            <a href="/technologies">Technologies</a>
          </li>
        )}
      </ul>
      <ul className="Navbar-Links">
        <li className="Navbar-Link compact">
          <a href="/faq">FAQ</a>
        </li>
        <li className="Navbar-Link compact">
          <OutLink href="https://twitter.com/l2beatcom" title="Twitter">
            <TwitterIcon />
          </OutLink>
        </li>
        <li className="Navbar-Link compact">
          <OutLink href="https://github.com/l2beat/l2beat" title="Github">
            <GithubIcon />
          </OutLink>
        </li>
      </ul>
      <button className="Navbar-Mode" title="Change color scheme">
        <SunIcon className="Navbar-LightMode" aria-label="Toggle light mode" />
        <MoonIcon className="Navbar-DarkMode" aria-label="Toggle dark mode" />
      </button>
    </nav>
  )
}
