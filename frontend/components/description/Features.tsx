import { ProjectDetails } from '@l2beat/config'
import React from 'react'

import { Feature } from './Feature'
import styles from './styles.module.scss'

interface FeaturesProps {
  metadata: ProjectDetails
}

export function Features({ metadata }: FeaturesProps) {
  return (
    <div>
      <h4>Technology</h4>
      <p>
        {metadata.technology.name}
        {metadata.technology.details && <span> ({metadata.technology.details})</span>}
      </p>
      <h4>Overview</h4>
      <ul className={styles.features}>
        {metadata.features?.map((feature, i) => (
          <Feature key={i} feature={feature} />
        ))}
      </ul>
    </div>
  )
}
