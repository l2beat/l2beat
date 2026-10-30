export function Keys(props: { keys: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {props.keys.map((key, i) => (
        <kbd
          key={i}
          className="rounded-sm border border-coffee-600 bg-coffee-700 px-1 font-mono text-[11px] text-coffee-200 leading-4"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}
