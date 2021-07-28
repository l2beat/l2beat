import cx from 'classnames'
import { OverviewLink } from './OverviewLink'

interface Props {
  name: string
  links: string[]
  social?: boolean
}

export function OverviewLinks({ name, links, social }: Props) {
  if (links.length === 0) {
    return null
  }
  return (
    <tr className={cx(social && 'OverviewSection-SocialLinks')}>
      <th>{name}</th>
      <td>
        {links.map((x) => (
          <OverviewLink href={x} social={social} />
        ))}
      </td>
    </tr>
  )
}
