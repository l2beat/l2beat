import { ProjectDetails } from '@l2beat/config'
import React from 'react'

import { Parameter } from './Parameter'
import styles from './styles.module.scss'

interface ParametersProps {
  metadata: ProjectDetails
}

export function Parameters({ metadata }: ParametersProps) {
  return (
    <dl className={styles.parameters}>
      <dt>Technology</dt>
      <dd>
        <div>{metadata.technology.name}</div>
        {metadata.technology.details && <div className={styles.details}>{metadata.technology.details}</div>}
      </dd>
      {metadata.parameters?.map((param, i) => (
        <Parameter key={i} {...param} />
      ))}
    </dl>
  )
}
