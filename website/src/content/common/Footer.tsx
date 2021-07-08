import { OutLink } from './OutLink'

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        Made with love by the L2BEAT research team.
      </p>
      <p className="footer__text">
        Copyright {new Date().getFullYear()} L2BEAT.
      </p>
      <ul className="footer__links">
        <li className="footer__link">
          <OutLink href="https://twitter.com/l2beatcom">Twitter</OutLink>
        </li>
        <li className="footer__link">
          <OutLink href="https://github.com/l2beat/l2beat">Github</OutLink>
        </li>
      </ul>
    </footer>
  )
}
