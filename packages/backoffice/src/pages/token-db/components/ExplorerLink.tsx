import { ArrowRightIcon } from 'lucide-react'
import { buttonVariants } from '~/components/core/Button'
import { ExternalLink } from '~/components/ExternalLink'

interface Props {
  explorerUrl: string
  value: string
  type: 'address' | 'tx'
}

export function ExplorerLink({
  explorerUrl,
  value,
  type,
  children,
}: Props & { children?: React.ReactNode }) {
  const href = getHref(explorerUrl, value, type)

  return <ExternalLink href={href}>{children ?? value}</ExternalLink>
}

export function ExplorerLinkButton({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return (
    <ExternalLink
      href={href}
      showIcon={false}
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

function getHref(explorerUrl: string, value: string, type: 'address' | 'tx') {
  return `${explorerUrl}/${type}/${value}`
}
