import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Navigation } from './Navigation'
export function AppContainer(props: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.container}>
      <Head>
        <title>L2 Beat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>{props.children}</main>
    </div>
  )
}
