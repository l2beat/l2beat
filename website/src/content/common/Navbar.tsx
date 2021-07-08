import { Logo } from './Logo'

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
    </nav>
  )
}
