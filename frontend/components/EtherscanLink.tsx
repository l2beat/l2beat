import LinkIcon from '@material-ui/icons/Link'

import styles from './EtherscanLink.module.scss'

interface EtherscanLinkProps {
  address: string
}

export function EtherscanLink(props: EtherscanLinkProps) {
  const visibleAddress = (
    props.address.slice(0, 6) +
    '...' +
    props.address.slice(props.address.length - 4)
  ).toLowerCase()
  const link = `https://etherscan.io/address/${props.address}`
  return (
    <a href={link} className={styles.etherscanLink} target="blank">
      {visibleAddress}
      <LinkIcon fontSize="small" />
    </a>
  )
}
