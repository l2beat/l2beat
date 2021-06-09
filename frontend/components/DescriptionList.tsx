import HelpIcon from '@material-ui/icons/HelpOutline'
import LinkIcon from '@material-ui/icons/Link'
import cx from 'classnames'
import * as React from 'react'
import { assert } from 'ts-essentials'

import styles from './DescriptionList.module.scss'

export function List({ children }: React.PropsWithChildren<{}>) {
  return <dl className={styles.list}>{children}</dl>
}

interface DesorptionItemProps {
  title: string
  content: React.ReactNode
  className?: string
}

export function Item({ title, content, ...common }: DesorptionItemProps) {
  return (
    <div className={cx(styles.wrapper, common.className)}>
      <dt className={styles.title}>{title}</dt>
      <dl className={styles.content}>{content}</dl>
    </div>
  )
}

type Sentiment = 'bad' | 'good' | 'neutral'

interface ContentWithTooltipProps {
  text: string
  tooltip?: string
  sentiment?: Sentiment
  pointers?: string[]
}

export function ContentWithTooltip({ text, tooltip, sentiment, pointers }: ContentWithTooltipProps) {
  return (
    <>
      <span style={getStyleForSentiment(sentiment)}>{text}</span>
      {tooltip && (
        <div className="tooltip tooltip-inline" tabIndex={0} data-content={tooltip}>
          <HelpIcon fontSize="small" />
        </div>
      )}
      {pointers && (
        <div className={styles.pointers}>
          {pointers.map((p, i) => (
            <a key={i} href={p} target="blank">
              <LinkIcon fontSize="small" />
            </a>
          ))}
        </div>
      )}
    </>
  )
}

function getStyleForSentiment(sentiment?: Sentiment): object {
  if (!sentiment) {
    return {}
  }
  if (sentiment === 'good') {
    return { color: 'green' }
  }
  if (sentiment === 'bad') {
    return { color: 'red' }
  }
  // eslint-disable-next-line
  if (sentiment === 'neutral') {
    return { color: 'blue' }
  }

  // eslint-disable-next-line
  assert(false, `Unknown sentiment ${sentiment}. Should be good, bad, neutral or null`)
}
