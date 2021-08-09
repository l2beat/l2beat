import { createElement, HTMLAttributes } from 'react'
import cx from 'classnames'
import { OutLink } from './OutLink'

export interface HeadingProps {
  level: number
  id: string
  title: string
  links?: HeadingLink[]
  className?: string
}

export interface HeadingLink {
  name: string
  href: string
}

export function Heading(props: HeadingProps) {
  return (
    <Hx
      level={props.level}
      id={props.id}
      className={cx('Heading', `level-${props.level}`, props.className)}
    >
      <a className="Heading-Title" href={`#${props.id}`}>
        {props.title}
      </a>
      {props.links?.map((link, i) => (
        <OutLink key={i} className="Heading-Link" href={link.href}>
          [{link.name}]
        </OutLink>
      ))}
    </Hx>
  )
}

function Hx({
  level,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level: number }) {
  return createElement('h' + level, props)
}
