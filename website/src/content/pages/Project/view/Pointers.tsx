import { Pointer } from '@l2beat/config'
import { OutLink } from '../../../common'

interface PointersProps {
  pointers?: Pointer[]
  className?: string
}

export function Pointers({ pointers, className }: PointersProps) {
  if (!pointers) {
    return null
  }
  return (
    <ul className={className}>
      {pointers.map((pointer, i) => (
        <li key={i}>
          <OutLink href={pointer.href}>{pointer.name}</OutLink>
        </li>
      ))}
    </ul>
  )
}
