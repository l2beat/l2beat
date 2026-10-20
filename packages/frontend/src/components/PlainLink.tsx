import type { AnchorHTMLAttributes } from 'react'
import { isExternalUrl } from '~/utils/isExternalUrl'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  allowReferrer?: boolean
}

export function PlainLink({ allowReferrer, ...props }: Props) {
  const isExternal = isExternalUrl(props.href)

  const rel = isExternal
    ? allowReferrer
      ? 'noopener'
      : 'noopener noreferrer'
    : undefined
  return <a rel={rel} target={isExternal ? '_blank' : undefined} {...props} />
}
