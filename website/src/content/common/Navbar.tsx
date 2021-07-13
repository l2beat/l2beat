import { GithubIcon, MoonIcon, SunIcon, TwitterIcon } from './icons'
import { Logo } from './Logo'
import { OutLink } from './OutLink'

export function Navbar() {
  return (
    <nav className="navbar">
      <a href="/">
        <Logo className="navbar__logo" />
      </a>
      <ul className="navbar__links navbar__links--left">
        <li className="navbar__link">
          <a href="/">Overview</a>
        </li>
        <li className="navbar__link">
          <a href="/technologies">Technologies</a>
        </li>
      </ul>
      <ul className="navbar__links navbar__links--compact">
        <li className="navbar__link">
          <a href="/faq">FAQ</a>
        </li>
        <li className="navbar__link">
          <OutLink href="https://twitter.com/l2beatcom" title="Twitter">
            <TwitterIcon aria-label="Twitter" />
          </OutLink>
        </li>
        <li className="navbar__link">
          <OutLink href="https://github.com/l2beat/l2beat" title="Github">
            <GithubIcon aria-label="Github" />
          </OutLink>
        </li>
      </ul>
      <button className="navbar__mode" title="Change color scheme">
        <SunIcon className="navbar__light-mode" aria-label="Light Mode" />
        <MoonIcon className="navbar__dark-mode" aria-label="Light Mode" />
      </button>
    </nav>
  )
}
