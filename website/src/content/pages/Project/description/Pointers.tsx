import { OutLink } from '../../../common'

interface PointersProps {
  pointers?: string[]
}

export function Pointers({ pointers }: PointersProps) {
  if (!pointers) {
    return null
  }
  return (
    <>
      {pointers.map((url, i) => (
        <OutLink key={i} href={url}>
          {new URL(url).origin}
        </OutLink>
      ))}
    </>
  )
}
