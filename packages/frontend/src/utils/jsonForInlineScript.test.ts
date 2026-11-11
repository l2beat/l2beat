import { expect } from 'earl'
import { jsonForInlineScript } from './jsonForInlineScript'

// The page data sits in `<script type="application/json">`, which the HTML
// parser still ends at `</script` and switches into its escaped state at
// `<!--`. A payload with no `<` can do neither, and must still parse back.
describe(jsonForInlineScript.name, () => {
  const hostile = {
    name: '</script><script>alert(1)</script>',
    comment: '<!--<script>',
    nested: ['</SCRIPT >', { '<key>': 'a<b' }],
  }

  it('emits no "<" for strings that could end or escape the script', () => {
    expect(jsonForInlineScript(hostile).includes('<')).toEqual(false)
  })

  it('parses back to the same value with JSON.parse', () => {
    expect(JSON.parse(jsonForInlineScript(hostile))).toEqual(hostile)
  })
})
