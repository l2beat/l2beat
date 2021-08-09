import { OutLink } from '../../../common'

interface EtherscanLinkProps {
  address: string
}

export function EtherscanLink({ address }: EtherscanLinkProps) {
  const link = `https://etherscan.io/address/${address}`
  return (
    <OutLink href={link}>
      {address.slice(0, 6)}…{address.slice(38, 42)}
    </OutLink>
  )
}
