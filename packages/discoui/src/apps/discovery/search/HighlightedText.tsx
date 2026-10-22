interface HighlightedTextProps {
  text: string
  run: string
}

export function HighlightedText({ text, run }: HighlightedTextProps) {
  const matchIndex = text.toLowerCase().indexOf(run.toLowerCase())
  if (matchIndex === -1) {
    return <div>{text}</div>
  }

  const beforeMatch = text.slice(0, matchIndex)
  const match = text.slice(matchIndex, matchIndex + run.length)
  const afterMatch = text.slice(matchIndex + run.length)
  return (
    <div>
      {beforeMatch}
      <span className="font-bold text-autumn-300">{match}</span>
      {afterMatch}
    </div>
  )
}
