import { default as React } from 'react'

import { DASHBOARD_COLORS } from '../constants'

interface IndicatorProps {
  text: string
  color: string
  background: string
}

function Indicator(props: IndicatorProps) {
  return (
    <span
      style={{
        background: props.background,
        color: props.color,
        borderRadius: '4px',
        padding: '2px 3px 3px 2px',
        marginLeft: '8px',
        fontSize: '12px',
      }}
    >
      {props.text}
    </span>
  )
}

export function ProxyIndicator({ type }: { type?: string }) {
  if (type === undefined || type === 'immutable') {
    return null
  }
  return (
    <Indicator
      text={type}
      color="white"
      background={DASHBOARD_COLORS.PROXY_BACKGROUND}
    />
  )
}

export function InitialIndicator({ isInitial }: { isInitial?: boolean }) {
  if (!isInitial) {
    return null
  }
  return <Indicator text="initial" color="black" background="#F7DC6F" />
}
