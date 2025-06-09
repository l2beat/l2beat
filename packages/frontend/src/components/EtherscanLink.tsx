import { CustomLink } from './link/CustomLink'

interface EtherscanLinkProps {
  address: string
  href?: string
  className?: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const href = props.href ?? `https://etherscan.io/address/${props.address}`
  return (
    <CustomLink href={href} className={props.className}>
      {props.address.slice(0, 6)}…{props.address.slice(38, 42)}
    </CustomLink>
  )
}
