/**
 * A report's title without the auditor's name in trailing parentheses. The
 * audit dataset writes titles like "Optimism Upgrade 20 Security Review
 * (Cantina Managed)", and the auditor is shown next to the title anyway. What
 * else the parentheses say stays: "(Cantina, MCP L1)" becomes "(MCP L1)", and
 * a list of firms, "(Spearbit/Cantina)", is left alone.
 */
export function reportDisplayTitle(title: string, auditor: string): string {
  const match = /^(.*\S)\s*\(([^()]*)\)$/.exec(title.trim())
  if (!match) return title
  const [, head, inside] = match as unknown as [string, string, string]
  const kept = inside
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !namesAuditor(part, auditor))
  if (kept.length === inside.split(',').length) return title
  return kept.length === 0 ? head : `${head} (${kept.join(', ')})`
}

function namesAuditor(part: string, auditor: string): boolean {
  if (part.includes('/')) return false
  const first = (text: string) => text.toLowerCase().split(/\s+/)[0]
  return first(part) === first(auditor)
}
