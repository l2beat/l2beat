import { OutLink } from '../../../common'

interface EtherscanLinkProps {
  address: string
}

export function EtherscanLink({ address }: EtherscanLinkProps) {
  const visibleAddress = (
    address.slice(0, 6) +
    '...' +
    address.slice(address.length - 4)
  ).toLowerCase()

  const link = `https://etherscan.io/address/${address}`
  return <OutLink href={link}>{visibleAddress}</OutLink>
}
