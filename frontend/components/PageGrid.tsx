import React from 'react'

import styles from './Grid.module.scss'

export function PageGrid(props: React.PropsWithChildren<{}>) {
  return <div className={styles.grid}>{props.children}</div>
}

export function FullPageGrid(props: React.PropsWithChildren<{}>) {
  return <div className={styles.fullPageGrid}>{props.children}</div>
}
