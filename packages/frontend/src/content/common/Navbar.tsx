import React from 'react'

import { config } from '../config'
import {
  DiscordIcon,
  GithubIcon,
  MoonIcon,
  SunIcon,
  TwitterIcon,
} from './icons'
import { Logo } from './Logo'
import { OutLink } from './OutLink'

export function Navbar() {
  return (
    <>
      <nav className="Navbar">
        <a href="/">
          <Logo className="Navbar-Logo" />
        </a>
        <ul className="Navbar-Links left">
          <li className="Navbar-Link">
            <a className="Navbar-Donate" href="/donate">
              Donate
            </a>
          </li>
          <li className="Navbar-Link less-important">
            <a href="/jobs">Jobs</a>
          </li>
        </ul>
        <ul className="Navbar-Links">
          <li className="Navbar-Link compact">
            <a href="/faq">FAQ</a>
          </li>
          <li className="Navbar-Link compact">
            <OutLink href={config.twitterLink} title="Twitter">
              <TwitterIcon />
            </OutLink>
          </li>
          <li className="Navbar-Link compact">
            <OutLink href={config.discordLink} title="Discord">
              <DiscordIcon />
            </OutLink>
          </li>
          <li className="Navbar-Link compact">
            <OutLink href={config.githubLink} title="Github">
              <GithubIcon />
            </OutLink>
          </li>
        </ul>
        <button className="Navbar-Mode" title="Change color scheme">
          <SunIcon
            className="Navbar-LightMode"
            aria-label="Toggle light mode"
          />
          <MoonIcon className="Navbar-DarkMode" aria-label="Toggle dark mode" />
        </button>
      </nav>
    </>
  )
}
