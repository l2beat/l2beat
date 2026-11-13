/**
 * Contract and program names are identifiers ("L2CrossDomainMessenger",
 * "StarkWare_GpsStatementVerifier_2026_14"). On narrow columns they may break
 * only between words (before an inner capital, after a word's "_"), never
 * mid-word, and a trailing version like "2026_14" stays whole.
 */
export function withIdentifierBreaks(name: string) {
  return name
    .split(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Za-z]_)/)
    .flatMap((part, i) => (i === 0 ? [part] : [<wbr key={i} />, part]))
}
