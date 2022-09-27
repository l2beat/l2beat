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
  sevenDayChangeTvl?: string
  txCount?: string
  sevenDayChangeTxCount?: string
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
      {props.tvl && props.sevenDayChangeTvl && (
        <div className="Header-Right">
          <p className="Header-Tvl">
            TVL: <span className="Header-TvlValue">{props.tvl}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.sevenDayChangeTvl} /> / 7 days
          </p>
        </div>
      )}

      {props.txCount && props.sevenDayChangeTxCount && (
        <div className="Header-Right">
          <p className="Header-Tvl">
            Tx count: <span className="Header-TvlValue">{props.txCount}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.sevenDayChangeTxCount} /> / 7 days
          </p>
        </div>
      )}
    </header>
  )
}
