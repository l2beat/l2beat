import { expect } from 'earl'
import { readFileSync } from 'fs'
import { UserHandlers } from '../../handlers/user'
import {
  editOperatorsOf,
  parseReadme,
  README_PATH,
  readmeIndex,
  readmeReferenceFor,
} from './readmeSections'

/**
 * Over the real README, so a renamed heading or a handler section that
 * stops naming its type is caught here rather than in a prompt.
 */
describe(parseReadme.name, () => {
  const readme = parseReadme(readFileSync(README_PATH, 'utf8'))

  it('finds a section for every handler type the README documents, each naming a type V1 has', () => {
    const types = [...readme.handlers.keys()]
    expect(types.length).toBeGreaterThanOrEqual(19)
    for (const type of types) {
      expect(Object.keys(UserHandlers)).toInclude(type)
    }
    expect(types).toInclude(
      'event',
      'scrollAccessControl',
      'lineaRolesModule',
      'eventCount',
      'opStackDA',
    )
    expect(
      readme.handlers.get('event')?.startsWith('### Event handler'),
    ).toEqual(true)
    expect(readme.handlers.get('event') ?? '').toInclude('"type": "event"')
    expect(readme.handlers.get('eventCount') ?? '').toInclude(
      '"type": "eventCount"',
    )
    expect(readme.handlers.get('eventCount') ?? '').not.toInclude(
      '### Access control handler',
    )
  })

  it('finds the edit operators under the Edit section, each ending at the next heading', () => {
    expect([...readme.operators.keys()]).toInclude(
      'pipe',
      'map',
      'get',
      'format',
      'shape',
      'to_entries',
    )
    expect(readme.operators.get('get')?.startsWith('### `get`')).toEqual(true)
    expect(readme.operators.get('get') ?? '').toInclude('["get", "b", "c"]')
    expect(readme.operators.get('get') ?? '').not.toInclude('### `set`')
    expect(readme.operators.get('pipe')?.startsWith('#### `pipe`')).toEqual(
      true,
    )
    expect(readme.operators.get('pipe') ?? '').not.toInclude('#### `map`')
  })

  it('reads the package README once', () => {
    expect(readmeIndex().handlers.size).toEqual(readme.handlers.size)
  })
})

describe(readmeReferenceFor.name, () => {
  const readme = parseReadme(readFileSync(README_PATH, 'utf8'))

  it('returns nothing for the seven generic handler types and the two documented edit operators', () => {
    expect(
      readmeReferenceFor(
        ['call', 'event', 'accessControl', 'hardcoded'],
        ['format', 'get'],
        readme,
      ),
    ).toEqual([])
  })

  it('returns the README section of every other handler type and operator, once each', () => {
    const lines = readmeReferenceFor(
      ['scrollAccessControl', 'event', 'scrollAccessControl'],
      ['pipe', 'format', 'map'],
      readme,
    )
    expect(lines.length).toEqual(3)
    expect(lines[0]?.startsWith('### Scroll access control handler')).toEqual(
      true,
    )
    expect(lines[1]?.startsWith('#### `pipe`')).toEqual(true)
    expect(lines[2]?.startsWith('#### `map`')).toEqual(true)
  })

  it('describes a handler type the README does not document by the keys of its V1 schema', () => {
    const [line] = readmeReferenceFor(['aragonPermissions'], [], readme)
    expect(line ?? '').toMatchRegex(
      /^`aragonPermissions` handler: the README does not document it; its definition keys are: type, .*\.$/,
    )
    expect(readmeReferenceFor(['nope'], [], readme)).toEqual([
      '`nope`: not a handler type V1 has.',
    ])
    expect(readmeReferenceFor([], ['frobnicate'], readme)).toEqual([
      '`frobnicate`: an edit operator the README does not document.',
    ])
  })
})

describe(editOperatorsOf.name, () => {
  it('lists the operator of every nested program', () => {
    expect(
      editOperatorsOf([
        'pipe',
        ['map', ['shape', 'a', 'b']],
        ['format', 'FormatSeconds'],
      ]),
    ).toEqual(['pipe', 'map', 'shape', 'format'])
    expect(editOperatorsOf(['get', 'owner'])).toEqual(['get'])
    expect(editOperatorsOf(undefined)).toEqual([])
    expect(editOperatorsOf('x')).toEqual([])
  })
})
