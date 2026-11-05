/** How long ago, coarser the older it is: "12 s ago", "4 min ago", "2 h ago" */
export function formatAge(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  if (s < 60) return `${s} s ago`
  if (s < 60 * 60) return `${Math.floor(s / 60)} min ago`
  return `${Math.floor(s / (60 * 60))} h ago`
}
