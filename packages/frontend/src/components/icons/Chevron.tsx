import classNames from 'classnames'
import React, { SVGAttributes } from 'react'

import { Icon } from './Icon'

export function ChevronRightIcon(props: SVGAttributes<SVGElement>) {
  const { className, ...rest } = props
  return (
    <ChevronDownIcon
      className={classNames('-rotate-90', className)}
      {...rest}
    />
  )
}

export function ChevronLeftIcon(props: SVGAttributes<SVGElement>) {
  const { className, ...rest } = props
  return (
    <ChevronDownIcon className={classNames('rotate-90', className)} {...rest} />
  )
}

export function ChevronDownIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      width="16"
      height="10"
      viewBox="0 0 16 10"
      aria-label="Dropdown arrow icon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.484284 0.551423C0.952914 0.0827939 1.71271 0.0827939 2.18134 0.551423L7.99948 6.36956L13.8176 0.551423C14.2862 0.0827939 15.046 0.0827939 15.5147 0.551423C15.9833 1.02005 15.9833 1.77985 15.5147 2.24848L8.94229 8.82087C8.42159 9.34156 7.57737 9.34157 7.05667 8.82087L0.484284 2.24848C0.0156552 1.77985 0.0156552 1.02005 0.484284 0.551423Z"
      />
    </Icon>
  )
}
