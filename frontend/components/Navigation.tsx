import GitHubIcon from '@material-ui/icons/GitHub'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './Navigation.module.scss'

const HomePath = '/'
export const Navigation = () => {
  const router = useRouter()

  return (
    <header className={styles.container}>
      <Link href={HomePath}>
        <h1 className={styles.logo}>
          <div className={cx(styles.logoEmoji, router.asPath === '/' && styles['animate-beat'])}>💓</div>
          <span className={styles.logoText}>L2Beat</span>
        </h1>
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
