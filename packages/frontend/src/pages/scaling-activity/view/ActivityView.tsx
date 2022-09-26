import classNames from 'classnames'
import React from 'react'

export interface ActivityViewProps {
  className?: string
}

export function ActivityView({ className }: ActivityViewProps) {
  return <section className={classNames('ActivityView', className)}></section>
}
