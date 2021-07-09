import { Logo } from './Logo'
import { OutLink } from './OutLink'

export function Navbar() {
  return (
    <nav className="navbar">
      <Logo className="navbar__logo" />
      <ul className="navbar__links navbar__links--left">
        <li className="navbar__link">
          <a href="/">Overview</a>
        </li>
        <li className="navbar__link">
          <a href="/technologies">Technologies</a>
        </li>
      </ul>
      <ul className="navbar__links navbar__links--right">
        <li className="navbar__link">
          <a href="/faq">Faq</a>
        </li>
        <li className="navbar__link">
          <OutLink href="https://twitter.com/l2beatcom">Twitter</OutLink>
        </li>
        <li className="navbar__link">
          <OutLink href="https://github.com/l2beat/l2beat">Github</OutLink>
        </li>
      </ul>
    </nav>
  )
}
