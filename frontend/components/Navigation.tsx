import GitHubIcon from '@material-ui/icons/GitHub'
import Link from 'next/link'

import styles from './Navigation.module.scss'

const HomePath = '/'
export const Navigation = () => {
  return (
    <header className={styles.container}>
      <Link href={HomePath}>
        <h1 className={styles.logo}>l2beat</h1>
      </Link>
      <nav title="Main navigation" className={styles.linksWrapper}>
        <div className={styles.link}>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className={styles.link}>
          <a href="https://github.com/krzkaczor/l2beat">
            <GitHubIcon />
          </a>
        </div>
      </nav>
    </header>
  )
}
