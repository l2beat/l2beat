interface EtherscanLinkProps {
  address: string
}

export function EtherscanLink({ address }: EtherscanLinkProps) {
  const visibleAddress = (address.slice(0, 6) + '...' + address.slice(address.length - 4)).toLowerCase()

  const link = `https://etherscan.io/address/${address}`
  return (
    <a href={link} target="blank">
      {visibleAddress}
    </a>
  )
}
