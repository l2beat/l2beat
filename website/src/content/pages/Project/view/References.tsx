interface Props {
  ids: number[]
  editLink?: string
}

export function References({ ids, editLink }: Props) {
  if (ids.length === 0) {
    if (editLink) {
      return (
        <sup>
          <a href={editLink}>[Citation needed]</a>
        </sup>
      )
    } else {
      return null
    }
  }
  return (
    <sup>
      {ids.map((id) => (
        <a key={id} href={`#reference-${id}`}>
          [{id}]
        </a>
      ))}
    </sup>
  )
}
