import { expect } from 'earl'
import type { ApiAddressUsageResponse } from '../../../api/types'
import { summarizeAddressUsage } from './addressUsage'

const MODULE = 'shared-zk-stack'
const OWN = 'eth:0x0000000000000000000000000000000000000001'
const CONDUIT_SAFE = 'eth:0x0000000000000000000000000000000000000002'
const BRIDGE_HUB = 'eth:0x0000000000000000000000000000000000000003'
const MODULE_INTERNAL = 'eth:0x0000000000000000000000000000000000000004'

const USAGE: ApiAddressUsageResponse = {
  sharedAddresses: {
    [CONDUIT_SAFE]: [
      { project: 'aevo', name: 'Safe' },
      { project: 'bob', name: 'Safe' },
      { project: 'ancient', name: 'ConduitSafe' },
    ],
    [BRIDGE_HUB]: [
      { project: 'abstract', name: 'BridgeHub', viaModule: MODULE },
      { project: MODULE, name: 'BridgeHub' },
      { project: 'sophon', name: 'BridgeHub', viaModule: MODULE },
    ],
  },
  moduleConsumers: { [MODULE]: ['abstract', 'lens', 'sophon'] },
  entrypoints: { [BRIDGE_HUB]: { project: MODULE, name: 'BridgeHub' } },
}

describe(summarizeAddressUsage.name, () => {
  it('calls an address no other project uses standalone', () => {
    expect(summarizeAddressUsage(USAGE, OWN, 'aevo', 'aevo')).toEqual({
      status: 'standalone',
    })
  })

  it('lists the other projects that discover the same address', () => {
    expect(summarizeAddressUsage(USAGE, CONDUIT_SAFE, 'aevo', 'aevo')).toEqual({
      status: 'duplicated',
      places: [
        { project: 'ancient', name: 'ConduitSafe', relation: 'discovers' },
        { project: 'bob', name: 'Safe', relation: 'discovers' },
      ],
    })
  })

  it('lists the module, its referrers and its consumers for an entrypoint', () => {
    expect(
      summarizeAddressUsage(USAGE, BRIDGE_HUB, 'abstract', MODULE),
    ).toEqual({
      status: 'shared-module',
      module: MODULE,
      entrypoint: { project: MODULE, name: 'BridgeHub' },
      places: [
        { project: MODULE, name: 'BridgeHub', relation: 'discovers' },
        { project: 'sophon', name: 'BridgeHub', relation: 'references' },
        { project: 'lens', relation: 'consumes-module' },
      ],
    })
  })

  it('treats an address inside a module as used by every consumer', () => {
    expect(
      summarizeAddressUsage(USAGE, MODULE_INTERNAL, 'lens', MODULE),
    ).toEqual({
      status: 'shared-module',
      module: MODULE,
      entrypoint: undefined,
      places: [
        { project: MODULE, relation: 'discovers' },
        { project: 'abstract', relation: 'consumes-module' },
        { project: 'sophon', relation: 'consumes-module' },
      ],
    })
  })

  it('does not list the module as a user when the module is opened', () => {
    const summary = summarizeAddressUsage(
      USAGE,
      MODULE_INTERNAL,
      MODULE,
      MODULE,
    )

    expect(summary).toEqual({
      status: 'shared-module',
      module: MODULE,
      entrypoint: undefined,
      places: [
        { project: 'abstract', relation: 'consumes-module' },
        { project: 'lens', relation: 'consumes-module' },
        { project: 'sophon', relation: 'consumes-module' },
      ],
    })
  })

  it('recognizes an entrypoint the opened project still discovers itself', () => {
    const usage: ApiAddressUsageResponse = {
      ...USAGE,
      sharedAddresses: {
        [BRIDGE_HUB]: [
          { project: 'lens', name: 'Bridgehub' },
          { project: MODULE, name: 'BridgeHub' },
          { project: 'sophon', name: 'BridgeHub', viaModule: MODULE },
        ],
      },
    }

    expect(summarizeAddressUsage(usage, BRIDGE_HUB, 'lens', 'lens')).toEqual({
      status: 'shared-module',
      module: MODULE,
      entrypoint: { project: MODULE, name: 'BridgeHub' },
      places: [
        { project: MODULE, name: 'BridgeHub', relation: 'discovers' },
        { project: 'sophon', name: 'BridgeHub', relation: 'references' },
        { project: 'abstract', relation: 'consumes-module' },
      ],
    })
  })

  it('treats an address that a used module also discovers as part of it', () => {
    const usage: ApiAddressUsageResponse = {
      ...USAGE,
      sharedAddresses: {
        [OWN]: [
          { project: 'lens', name: 'Operator' },
          { project: 'polygon', name: 'Operator' },
          { project: MODULE, name: 'Operator' },
        ],
      },
    }

    expect(summarizeAddressUsage(usage, OWN, 'lens', 'lens')).toEqual({
      status: 'shared-module',
      module: MODULE,
      entrypoint: undefined,
      places: [
        { project: 'polygon', name: 'Operator', relation: 'discovers' },
        { project: MODULE, name: 'Operator', relation: 'discovers' },
        { project: 'abstract', relation: 'consumes-module' },
        { project: 'sophon', relation: 'consumes-module' },
      ],
    })
  })

  it('does not tie an address to a module the opened project does not use', () => {
    const usage: ApiAddressUsageResponse = {
      ...USAGE,
      sharedAddresses: {
        [OWN]: [
          { project: 'aevo', name: 'Operator' },
          { project: MODULE, name: 'Operator' },
        ],
      },
    }

    expect(summarizeAddressUsage(usage, OWN, 'aevo', 'aevo')).toEqual({
      status: 'duplicated',
      places: [{ project: MODULE, name: 'Operator', relation: 'discovers' }],
    })
  })
})
