import type { LinkProps } from '~/_next/link'

export default function Link(props: LinkProps & { href: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { prefetch, ...stripped } = props
  return <a {...stripped} />
}
