import cx from 'classnames'
import React from 'react'

import { Logo } from './Logo'
import { PercentChange } from './PercentChange'

export interface HeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  tvl?: string
  tvlWeeklyChange?: string
  transactionCount?: string
  transactionCountWeeklyChange?: string
}

export function Header(props: HeaderProps) {
  return (
    <header className="Header">
      <h1
        className={cx('Header-Title', props.titleLength, props.titleClassName)}
      >
        {props.icon && (
          <img
            className="Header-Icon"
            src={props.icon}
            alt={`${props.title} logo`}
          />
        )}
        {props.title}
        {!props.title && <Logo />}
      </h1>
      {props.tvl && props.tvlWeeklyChange && (
        <div className="Header-Right">
          <p className="Header-Tvl">
            TVL: <span className="Header-TvlValue">{props.tvl}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.tvlWeeklyChange} /> / 7 days
          </p>
        </div>
      )}

      {props.transactionCount && props.transactionCountWeeklyChange && (
        <div className="Header-Right">
          <p className="Header-Tvl">
            Tx count:{' '}
            <span className="Header-TvlValue">{props.transactionCount}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.transactionCountWeeklyChange} /> / 7
            days
          </p>
        </div>
      )}
    </header>
  )
}
