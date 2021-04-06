import Head from 'next/head'
import React from 'react'

import styles from '../styles/Home.module.scss'
import { Logo, Navigation } from './Navigation'
export function AppContainer(props: React.PropsWithChildren<{}>) {
  return (
    <div>
      <Head>
        <title>L2 Beat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <div className={styles.container}>
        <main className={styles.main}>{props.children}</main>
      </div>
      <footer className={styles.footer}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>
      </footer>
    </div>
  )
}
