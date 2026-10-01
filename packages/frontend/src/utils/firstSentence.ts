export function firstSentence(text: string): string {
  const oneLine = text.replaceAll(/\s+/g, ' ').trim()
  const match = oneLine.match(/^.+?[.!?](?=\s|$)/)
  return match?.[0] ?? oneLine
}
