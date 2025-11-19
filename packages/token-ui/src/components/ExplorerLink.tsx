import { ArrowRightIcon } from 'lucide-react'
import { buttonVariants } from './core/Button'

interface Props {
  explorerUrl: string
  value: string
  type: 'address'
}

export function ExplorerLink({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline hover:text-blue-600"
    >
      {value}
    </a>
  )
}

export function ExplorerLinkButton({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({
        variant: 'outline',
        className: 'shrink-0',
      })}
    >
      <ArrowRightIcon />
    </a>
  )
}

function getHref(explorerUrl: string, value: string, type: 'address') {
  return `${explorerUrl}/${type}/${value}`
}
