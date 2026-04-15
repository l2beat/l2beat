// Minimal Clingo / ASP syntax highlighter. Returns an HTML string suitable
// for use with react-simple-code-editor's `highlight` prop.

const escapeHtml = (s: string): string =>
  s.replace(/[&<>]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;',
  )

const TOKEN = new RegExp(
  [
    /(?<comment>%[^\n]*)/,
    /(?<string>"(?:[^"\\]|\\.)*")/,
    /(?<directive>#\w+)/,
    /(?<op>:-|:~)/,
    /(?<keyword>\bnot\b)/,
    /(?<variable>\b[A-Z_]\w*)/,
    /(?<number>\b\d+\b)/,
  ]
    .map((r) => r.source)
    .join('|'),
  'g',
)

const CLASSES: Record<string, string> = {
  comment: 'text-muted-foreground italic',
  string: 'text-emerald-600 dark:text-emerald-400',
  directive: 'text-sky-600 dark:text-sky-400',
  op: 'text-rose-600 dark:text-rose-400 font-semibold',
  keyword: 'text-purple-600 dark:text-purple-400 font-semibold',
  variable: 'text-amber-600 dark:text-amber-400',
  number: 'text-cyan-600 dark:text-cyan-400',
}

export function highlightClingo(code: string): string {
  let out = ''
  let last = 0
  for (const m of code.matchAll(TOKEN)) {
    const idx = m.index ?? 0
    if (idx > last) out += escapeHtml(code.slice(last, idx))
    const key =
      Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0] ?? ''
    out += `<span class="${CLASSES[key] ?? ''}">${escapeHtml(m[0])}</span>`
    last = idx + m[0].length
  }
  if (last < code.length) out += escapeHtml(code.slice(last))
  return out
}
