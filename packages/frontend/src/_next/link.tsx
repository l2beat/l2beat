import type { LinkProps } from 'next/link'

export default function Link(props: LinkProps & { href: string }) {
  return <a {...props} />
}
