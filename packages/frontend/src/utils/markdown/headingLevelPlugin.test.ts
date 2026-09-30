import { expect } from 'earl'
import MarkdownIt from 'markdown-it'
import { headingLevelPlugin } from './headingLevelPlugin'

// Why: markdown authors start at whatever level they like, but inside a
// section the snippet's top heading must land exactly one level below it.
// How: render snippets at different parent levels and compare the tags.
describe(headingLevelPlugin.name, () => {
  const markdown = MarkdownIt().use(headingLevelPlugin)
  const render = (text: string, parentHeadingLevel?: number) =>
    markdown.render(text, { parentHeadingLevel }).trim()

  it('keeps authored levels at page level', () => {
    expect(render('## A')).toEqual('<h2 class="mdc-h2">A</h2>')
  })

  it('moves the top heading one level below the parent, whatever it starts at', () => {
    expect(render('# A\n\n## B', 2)).toEqual(
      '<h3 class="mdc-h1">A</h3>\n<h4 class="mdc-h2">B</h4>',
    )
    expect(render('### A\n\n#### B', 2)).toEqual(
      '<h3 class="mdc-h3">A</h3>\n<h4 class="mdc-h4">B</h4>',
    )
  })

  it('clamps at h6', () => {
    expect(render('# A\n\n###### B', 4)).toEqual(
      '<h5 class="mdc-h1">A</h5>\n<h6 class="mdc-h6">B</h6>',
    )
  })
})
