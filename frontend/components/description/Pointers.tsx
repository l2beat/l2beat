import LinkIcon from '@material-ui/icons/Link'
import * as React from 'react'

import styles from './styles.module.scss'

interface PointersProps {
  pointers?: string[]
}

export function Pointers({ pointers }: PointersProps) {
  if (!pointers) {
    return null
  }
  return (
    <>
      {pointers.map((p, i) => (
        <a key={i} href={p} target="blank" className={styles.pointer}>
          <LinkIcon fontSize="small" />
        </a>
      ))}
    </>
  )
}
