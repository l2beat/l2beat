import { CustomLink } from './custom-link'

interface EtherscanLinkProps {
  address: string
  truncate?: boolean
  etherscanUrl?: string
  className?: string
}

export function EtherscanLink({
  address,
  truncate = true,
  etherscanUrl = 'https://etherscan.io',
  className,
}: EtherscanLinkProps) {
  const link = `${etherscanUrl}/address/${address}`
  return (
    <CustomLink href={link} className={className} data-role={'etherscan-link'}>
      {truncate ? `${address.slice(0, 6)}…${address.slice(38, 42)}` : address}
    </CustomLink>
  )
}
