import { expect } from 'earl'
import { toSnippetTemplate } from './json'

describe('toSnippetTemplate', () => {
  it('wraps bare tab stops in braces', () => {
    expect(toSnippetTemplate('"name": "$1"')).toEqual('"name": "${1}"')
    expect(toSnippetTemplate('"$12"$0')).toEqual('"${12}"${0}')
  })

  it('keeps tab stops with placeholders', () => {
    expect(toSnippetTemplate('"maxDepth": ${1:0}')).toEqual(
      '"maxDepth": ${1:0}',
    )
  })

  it('drops the backslash of escaped characters', () => {
    expect(toSnippetTemplate('"\\$ref": "\\}"')).toEqual('"$ref": "}"')
  })
})
