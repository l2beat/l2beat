import { ArrowRightIcon } from 'lucide-react'
import { buttonVariants } from './core/Button'
import { ExternalLink } from './ExternalLink'

interface Props {
  explorerUrl: string
  value: string
  type: 'address'
}

export function ExplorerLink({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return <ExternalLink href={href}>{value}</ExternalLink>
}

export function ExplorerLinkButton({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return (
    <ExternalLink
      href={href}
      className={buttonVariants({
        variant: 'outline',
        className: 'shrink-0 text-[unset]',
        size: 'icon',
      })}
    >
      <ArrowRightIcon />
    </ExternalLink>
  )
}

function getHref(explorerUrl: string, value: string, type: 'address') {
  return `${explorerUrl}/${type}/${value}`
}
