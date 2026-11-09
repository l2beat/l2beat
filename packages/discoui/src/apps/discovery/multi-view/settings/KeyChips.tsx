export function KeyChips(props: { labels: readonly string[] }) {
  return props.labels.map((label) => (
    <kbd
      key={label}
      className="flex h-6 min-w-6 items-center justify-center rounded-sm bg-coffee-700 px-1.5 font-sans text-coffee-200 text-xs dark:bg-coffee-600"
    >
      {label}
    </kbd>
  ))
}
