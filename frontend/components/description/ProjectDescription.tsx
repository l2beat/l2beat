import { BridgeDescription, ProjectDetails } from '@l2beat/config'
import React from 'react'

import { EtherscanLink } from './EtherscanLink'
import { Features } from './Features'
import { Parameters } from './Parameters'
import { Pointers } from './Pointers'
import styles from './styles.module.scss'

interface ProjectDescriptionProps {
  metadata: ProjectDetails
  bridges: BridgeDescription[]
}

export function ProjectDescription({ metadata, bridges }: ProjectDescriptionProps) {
  return (
    <div className={styles.container}>
      {metadata.parameters && <Parameters metadata={metadata} />}
      {metadata.features && <Features metadata={metadata} />}

      {metadata.notes && (
        <>
          <hr className={styles.separator} />
          <div className={styles.title}>Notes</div>
          <p className={styles.text}>
            {metadata.notes.text} <Pointers pointers={metadata.notes.pointers} />
          </p>
        </>
      )}

      <hr className={styles.separator} />
      <div className={styles.title}>Tracked bridges</div>
      <ul>
        {bridges.map((bridge, i) => (
          <li key={i}>
            <EtherscanLink address={bridge.address} /> - {bridge.tokens.map((t: string) => t).join(', ')}
          </li>
        ))}
      </ul>

      {metadata.news && (
        <>
          <hr className={styles.separator} />
          <div className={styles.title}>News</div>
          <ul>
            {metadata.news.map((news, i) => (
              <li key={i}>
                <a href={news.link}>{news.name}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
