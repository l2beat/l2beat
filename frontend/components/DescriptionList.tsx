import * as React from 'react'

import styles from './DescriptionList.module.scss'

export function List({ children }: React.PropsWithChildren<{}>) {
  return <dl className={styles.list}>{children}</dl>
}

interface DesorptionItemProps {
  title: string
  content: React.ReactNode
}

export function Item({ title, content }: DesorptionItemProps) {
  return (
    <div className={styles.wrapper}>
      <dt className={styles.title}>{title}</dt>
      <dl className={styles.content}>{content}</dl>
    </div>
  )
}
