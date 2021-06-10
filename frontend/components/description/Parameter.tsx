import { ProjectParameter } from '@l2beat/config'

import { Pointers } from './Pointers'
import { SentimentIcon } from './SentimentIcon'
import styles from './styles.module.scss'
import { Tooltip } from './Tooltip'

export function Parameter({ name, value, sentiment, tooltip, pointers }: ProjectParameter) {
  return (
    <>
      <dt>{name}</dt>
      <dd className={styles.parameter} data-sentiment={sentiment}>
        {sentiment && <SentimentIcon sentiment={sentiment} />}
        {value}
        {tooltip && <Tooltip text={tooltip} />}
        <Pointers pointers={pointers} />
      </dd>
    </>
  )
}
