import React from 'react'

import { Config } from '../build/config'
import { OutLink } from './OutLink'

export interface FooterProps {
  twitterLink: string
  discordLink: string
  githubLink: string
}

export function getFooterProps(config: Config): FooterProps {
  return {
    twitterLink: config.links.twitter,
    discordLink: config.links.discord,
    githubLink: config.links.github,
  }
}

export function Footer(props: FooterProps) {
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
          <OutLink className="text-link underline" href={props.twitterLink}>
            Twitter
          </OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink className="text-link underline" href={props.discordLink}>
            Discord
          </OutLink>
        </li>
        <li className="Footer-Link">
          <OutLink className="text-link underline" href={props.githubLink}>
            Github
          </OutLink>
        </li>
      </ul>
    </footer>
  )
}
