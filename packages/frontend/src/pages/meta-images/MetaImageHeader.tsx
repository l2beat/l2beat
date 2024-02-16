import React from 'react'

import { PercentChange } from '../../components/PercentChange'
import { cn } from '../../utils/cn'

export interface HeaderProps {
  title: string
  isProject: boolean
  icon?: string
  tvl?: string
  tvlWeeklyChange?: string
  tpsDaily?: string
  tpsWeeklyChange?: string
}

export function MetaImageHeader(props: HeaderProps) {
  return (
    <header className="mt-6 flex justify-between px-4">
      <h1
        className={cn(
          'relative flex items-center justify-start whitespace-pre text-[42px] font-bold leading-[1.15]',
          props.isProject &&
            'absolute left-1/2 top-1/2 z-100 w-max -translate-x-1/2 -translate-y-1/2 text-[64px]',
        )}
      >
        {props.icon && (
          <img
            className={cn('mr-2 block size-8', props.isProject && 'size-20')}
            src={props.icon}
            alt={`${props.title} logo`}
          />
        )}
        {props.title}
      </h1>

      {props.tvl && props.tvlWeeklyChange && (
        <div className="ml-auto" id="header-tvl">
          <p className="m-0 whitespace-pre text-right text-lg font-bold leading-[1.15] md:text-2xl">
            Value Locked:{' '}
            <span className="text-2xl leading-[1.15] md:text-3xl">
              {props.tvl}
            </span>
          </p>
          <p className="m-0 whitespace-pre text-right text-lg font-bold leading-[1.15] md:text-2xl">
            <PercentChange value={props.tvlWeeklyChange} /> / 7 days
          </p>
        </div>
      )}

      {props.tpsDaily && props.tpsWeeklyChange && (
        <div className="ml-auto" id="header-activity">
          <p className="m-0 whitespace-pre text-right text-lg font-bold leading-[1.15] md:text-2xl">
            TPS:{' '}
            <span className="text-2xl leading-[1.15] md:text-3xl">
              {props.tpsDaily}
            </span>
          </p>
          <p className="m-0 whitespace-pre text-right text-lg font-bold leading-[1.15] md:text-2xl">
            <PercentChange value={props.tpsWeeklyChange} /> / 7 days
          </p>
        </div>
      )}
    </header>
  )
}
