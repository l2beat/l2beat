interface Props {
  ids: number[]
}

export function References({ ids }: Props) {
  if (ids.length === 0) {
    return null
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
