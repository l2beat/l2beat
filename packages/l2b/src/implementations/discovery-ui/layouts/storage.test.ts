import { expect } from 'earl'
import mock from 'mock-fs'
import {
  LayoutStorageError,
  listProjectLayouts,
  readProjectLayout,
  writeProjectLayout,
} from './storage'

const PROJECT = 'zora'
const PROJECT_PATH = '/discovery/projects/zora'

describe('layout storage', () => {
  afterEach(() => {
    mock.restore()
  })

  it('lists saved layouts with descriptions', () => {
    mock({
      [PROJECT_PATH]: {
        layouts: {
          'beta.json': JSON.stringify({
            version: 3,
            projectId: PROJECT,
            metadata: {
              description: ' Second layout ',
            },
            locations: {},
          }),
          'alpha.json': JSON.stringify({
            version: 3,
            projectId: PROJECT,
            metadata: {
              description: 'First layout',
            },
            locations: {},
          }),
          'skip.txt': 'ignored',
        },
      },
    })

    expect(listProjectLayouts(PROJECT_PATH)).toEqual([
      { name: 'alpha', description: 'First layout' },
      { name: 'beta', description: 'Second layout' },
    ])
  })

  it('omits description when file content is invalid', () => {
    mock({
      [PROJECT_PATH]: {
        layouts: {
          'broken.json': '{not-json',
        },
      },
    })

    expect(listProjectLayouts(PROJECT_PATH)).toEqual([
      { name: 'broken', description: undefined },
    ])
  })

  it('writes normalized metadata and creates the layouts directory', () => {
    mock({
      [PROJECT_PATH]: {},
    })

    const written = writeProjectLayout({
      project: PROJECT,
      projectPath: PROJECT_PATH,
      name: 'research-layout',
      layout: {
        version: 3,
        projectId: PROJECT,
        metadata: {
          description: ' Useful layout ',
        },
        locations: {},
      },
    })

    expect(written).toEqual({
      version: 3,
      projectId: PROJECT,
      metadata: {
        description: 'Useful layout',
      },
      locations: {},
    })

    const parsed = readProjectLayout(PROJECT_PATH, 'research-layout')
    expect(parsed).toEqual(written)
  })

  it('drops invalid metadata description instead of rejecting the layout', () => {
    mock({
      [PROJECT_PATH]: {},
    })

    writeProjectLayout({
      project: PROJECT,
      projectPath: PROJECT_PATH,
      name: 'invalid description',
      layout: {
        version: 3,
        projectId: PROJECT,
        metadata: {
          description: 123,
        },
        locations: {},
      },
    })

    expect(readProjectLayout(PROJECT_PATH, 'invalid description')).toEqual({
      version: 3,
      projectId: PROJECT,
      locations: {},
    })
  })

  it('rejects overwriting without explicit permission', () => {
    mock({
      [PROJECT_PATH]: {
        layouts: {
          'research-layout.json': JSON.stringify({
            version: 3,
            projectId: PROJECT,
            locations: {},
          }),
        },
      },
    })

    expect(() =>
      writeProjectLayout({
        project: PROJECT,
        projectPath: PROJECT_PATH,
        name: 'research-layout',
        layout: {
          version: 3,
          projectId: PROJECT,
          locations: {},
        },
      }),
    ).toThrow(LayoutStorageError)

    expect(() =>
      writeProjectLayout({
        project: PROJECT,
        projectPath: PROJECT_PATH,
        name: 'research-layout',
        overwrite: true,
        layout: {
          version: 3,
          projectId: PROJECT,
          locations: {},
        },
      }),
    ).not.toThrow()
  })

  it('rejects project mismatches', () => {
    mock({
      [PROJECT_PATH]: {},
    })

    expect(() =>
      writeProjectLayout({
        project: PROJECT,
        projectPath: PROJECT_PATH,
        name: 'research-layout',
        layout: {
          version: 3,
          projectId: 'base',
          locations: {},
        },
      }),
    ).toThrow(LayoutStorageError)
  })

  it('rejects invalid names', () => {
    mock({
      [PROJECT_PATH]: {},
    })

    expect(() =>
      writeProjectLayout({
        project: PROJECT,
        projectPath: PROJECT_PATH,
        name: '../bad',
        layout: {
          version: 3,
          projectId: PROJECT,
          locations: {},
        },
      }),
    ).toThrow(LayoutStorageError)
  })
})
