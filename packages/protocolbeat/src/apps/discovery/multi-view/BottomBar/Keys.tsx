export function Keys(props: { keys: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {props.keys.map((key, i) => (
        <kbd
          key={i}
          className="rounded border-coffee-600 border-b-2 bg-coffee-200 px-1 text-coffee-800 leading-tight"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}
