import cx from 'classnames'
import React from 'react'

import { Logo } from '../Logo'
import { PercentChange } from '../PercentChange'

export interface HeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  tvl?: string
  tvlWeeklyChange?: string
  showTps?: boolean
  tpsDaily?: string
  tpsWeeklyChange?: string
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
        <div className="Header-Right" id="header-tvl">
          <p className="Header-Tvl">
            TVL: <span className="Header-TvlValue">{props.tvl}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.tvlWeeklyChange} /> / 7 days
          </p>
        </div>
      )}

      {props.tpsDaily && props.tpsWeeklyChange && (
        <div
          className={cx('Header-Right', !props.showTps ? 'hidden' : undefined)}
          id="header-activity"
        >
          <p className="Header-Tvl">
            TPS: <span className="Header-TvlValue">{props.tpsDaily}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.tpsWeeklyChange} /> / 7 days
          </p>
        </div>
      )}
    </header>
  )
}
