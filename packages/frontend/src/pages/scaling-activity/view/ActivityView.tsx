import classNames from 'classnames'
import React from 'react'

export interface ActivityViewProps {
  className?: string
}

export interface ActivityViewEntry {
  name: string
  slug: string
}

export function ActivityView({ className }: ActivityViewProps) {
  return <section className={classNames('ActivityView', className)}></section>
}
