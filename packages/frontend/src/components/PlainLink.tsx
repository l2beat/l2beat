import type { AnchorHTMLAttributes } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  allowReferrer?: boolean
}

export function PlainLink({ allowReferrer, ...props }: Props) {
  const isCustomLink = props.href?.startsWith('http')

  const rel = isCustomLink
    ? allowReferrer
      ? 'noopener'
      : 'noopener noreferrer'
    : undefined
  return <a rel={rel} target={isCustomLink ? '_blank' : undefined} {...props} />
}
