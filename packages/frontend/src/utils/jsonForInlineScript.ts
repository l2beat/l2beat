/** Safe to embed in `<script>`: avoids `</script>` in JSON closing the tag early. */
export function jsonForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
