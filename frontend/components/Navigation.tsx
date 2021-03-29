import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import GitHubIcon from '@material-ui/icons/GitHub'

import styles from './Navigation.module.scss'

const HomePath = '/'

const Logo = () => {
    return (
        <svg
            className={styles.svg}
            width="168"
            height="38"
            viewBox="0 0 168 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                className={styles.beat}
                d="M0 19H98L103.5 14L110 29.5L118.5 8.5L125.5 32L135 1L137.5 19H167.5"
                stroke="black"
                stroke-width="3"
            />
        </svg>
    )
}
export const Navigation = () => {
    const { push } = useRouter()

    return (
        <header className={styles.container}>
            <Link href={HomePath}>
                <h1 className={styles.headerLink}>l2beat</h1>
            </Link>
            <Logo />
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
