import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type FlatLocation, FlatWorkspace } from '../FlatWorkspace'
import { createWorkspaceCache } from './workspaceCache'

const ROLLUP_PATH = '/p/rollup/.flat/Rollup.sol'
const MODULE_PATH = '/p/module/.flat/Bridge.sol'
const OTHER_PATH = '/p/other/.flat/Other.sol'

describe(createWorkspaceCache.name, () => {
  function workspaceWith(...paths: string[]) {
    return new FlatWorkspace(
      paths.map((path, i) => ({
        name: path,
        address: ChainSpecificAddress(`eth:0x${String(i + 1).repeat(40)}`),
        type: 'Contract',
        values: {},
        abi: [],
        sourcePaths: [path],
      })),
      () => '',
    )
  }

  // A project's workspace also holds the flats of the modules it references.
  const workspaces: Record<string, FlatWorkspace> = {
    rollup: workspaceWith(ROLLUP_PATH, MODULE_PATH),
    module: workspaceWith(MODULE_PATH),
    other: workspaceWith(OTHER_PATH),
  }

  function start(stamps: Record<string, string> = {}) {
    const loads: string[] = []
    const workspaceFor = createWorkspaceCache((location: FlatLocation) => {
      loads.push(location.project)
      const stamp = () => stamps[location.project] ?? ''
      return {
        workspace: workspaces[location.project] as FlatWorkspace,
        stamp: stamp(),
        currentStamp: stamp,
      }
    })
    return { workspaceFor, loads }
  }

  it('keeps the project a module file was reached from', () => {
    const { workspaceFor } = start()

    expect(workspaceFor(ROLLUP_PATH)).toEqual(workspaces.rollup)
    expect(workspaceFor(MODULE_PATH)).toEqual(workspaces.rollup)
  })

  it('switches to the own project of a file the current one lacks', () => {
    const { workspaceFor } = start()

    expect(workspaceFor(ROLLUP_PATH)).toEqual(workspaces.rollup)
    expect(workspaceFor(OTHER_PATH)).toEqual(workspaces.other)
    expect(workspaceFor(MODULE_PATH)).toEqual(workspaces.module)
  })

  it('reloads a project only when its inputs change', () => {
    const stamps = { rollup: 'a' }
    const { workspaceFor, loads } = start(stamps)
    workspaceFor(ROLLUP_PATH)
    workspaceFor(ROLLUP_PATH)
    stamps.rollup = 'b'
    workspaceFor(ROLLUP_PATH)

    expect(loads).toEqual(['rollup', 'rollup'])
  })

  it('reloads a project whose inputs cannot be read anymore', () => {
    let readable = true
    const loads: string[] = []
    const workspaceFor = createWorkspaceCache((location: FlatLocation) => {
      loads.push(location.project)
      return {
        workspace: workspaces[location.project] as FlatWorkspace,
        stamp: '',
        currentStamp: () => {
          assert(readable, 'Input removed')
          return ''
        },
      }
    })
    workspaceFor(ROLLUP_PATH)
    readable = false

    expect(workspaceFor(ROLLUP_PATH)).toEqual(workspaces.rollup)
    expect(loads).toEqual(['rollup', 'rollup'])
  })

  it('moves on from a project that cannot be loaded anymore', () => {
    let rollupLoadable = true
    const workspaceFor = createWorkspaceCache((location: FlatLocation) => {
      assert(location.project !== 'rollup' || rollupLoadable, 'Removed')
      return {
        workspace: workspaces[location.project] as FlatWorkspace,
        stamp: '',
        currentStamp: () => {
          assert(location.project !== 'rollup' || rollupLoadable, 'Removed')
          return ''
        },
      }
    })
    workspaceFor(ROLLUP_PATH)
    rollupLoadable = false

    expect(workspaceFor(OTHER_PATH)).toEqual(workspaces.other)
  })

  it('ignores files outside a .flat directory', () => {
    const { workspaceFor } = start()

    expect(workspaceFor('/tmp/A.sol')).toEqual(undefined)
  })
})
