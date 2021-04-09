import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './Navigation.module.scss'

const HomePath = '/'

export function Logo() {
  const router = useRouter()

  return (
    <>
      <div className={cx(styles.logoEmoji, router.asPath === '/' && styles['animate-beat'])}>💓</div>
      <span className={styles.logoText}>L2Beat</span>
    </>
  )
}
export const Navigation = () => {
  return (
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <Link href={HomePath}>
          <h1 className={styles.logo}>
            <Logo />
          </h1>
        </Link>
        <nav title="Main navigation" className={styles.linksWrapper}>
          <div className={styles.link}>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className={styles.link}>
            <a href="https://twitter.com/krzkaczor">
              <TwitterIcon />
            </a>
          </div>
          <div className={styles.link}>
            <a href="https://github.com/krzkaczor/l2beat">
              <GitHubIcon />
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
