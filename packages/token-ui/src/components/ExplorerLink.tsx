import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from './core/Button'

interface Props {
  explorerUrl: string
  value: string
  type: 'address'
}

export function ExplorerLink({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return (
    <Link
      to={href}
      target="_blank"
      className="text-blue-500 underline hover:text-blue-600"
    >
      {value}
    </Link>
  )
}

export function ExplorerLinkButton({ explorerUrl, value, type }: Props) {
  const href = getHref(explorerUrl, value, type)

  return (
    <Link
      to={href}
      target="_blank"
      className={buttonVariants({
        variant: 'outline',
        className: 'shrink-0',
      })}
    >
      <ArrowRightIcon />
    </Link>
  )
}

function getHref(explorerUrl: string, value: string, type: 'address') {
  return `${explorerUrl}/${type}/${value}`
}
