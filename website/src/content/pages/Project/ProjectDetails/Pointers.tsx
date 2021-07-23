import { OutLink } from '../../../common'

interface PointersProps {
  pointers?: string[]
  className?: string
}

export function Pointers({ pointers, className }: PointersProps) {
  if (!pointers) {
    return null
  }
  return (
    <ul className={className}>
      {pointers.map((url, i) => (
        <li key={i}>
          <OutLink href={url}>{new URL(url).origin + '/'}</OutLink>
        </li>
      ))}
    </ul>
  )
}
