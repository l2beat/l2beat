import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'

import styles from './Navigation.module.scss'

const HomePath = '/'
export const Navigation = () => {
    const { push } = useRouter()

    return (
        <header className={styles.container}>
            <Image className={styles.logoIcon} onClick={() => push(HomePath)} width={40} height={40} src="/logo.svg" alt="l2beat logo" />
            <Link href={HomePath}>
                <h1 className={styles.logo}>l2beat</h1>
            </Link>
            <nav title="Main navigation" className={styles.linksWrapper}>
                <div className={styles.link}>
                    <Link href="#">Menu 1</Link>
                </div>
                <div className={styles.link}>
                    <Link href="#">FAQ</Link>
                </div>
                <div className={styles.link}>
                    <Link href="#">Contribute</Link>
                </div>
            </nav>
        </header>
    )
}
