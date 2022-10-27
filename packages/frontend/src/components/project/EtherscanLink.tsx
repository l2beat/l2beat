import cx from 'classnames'
import React, { ReactNode } from 'react'

import { OutLink } from '../OutLink'

interface EtherscanLinkProps {
  address: string
  children?: ReactNode
  className?: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const link = `https://etherscan.io/address/${props.address}`
  return (
    <OutLink href={link} className={cx('text-link underline', props.className)}>
      {props.address.slice(0, 6)}…{props.address.slice(38, 42)}
      {props.children}
    </OutLink>
  )
}
