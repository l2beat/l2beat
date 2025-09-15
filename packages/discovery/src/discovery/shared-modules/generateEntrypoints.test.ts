import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import type { Entrypoint } from '../config/StructureConfig'
import { generateEntrypoints } from './generateEntrypoints'

const entrypoint1: Entrypoint = {
  project: 'project1',
  type: 'Contract',
  name: 'Entrypoint1',
}
const entrypoint2: Entrypoint = {
  project: 'project2',
  type: 'EOA',
  name: 'Entrypoint2',
}
const entrypoint3: Entrypoint = {
  project: 'project3',
  type: 'Contract',
  name: 'Entrypoint3',
}

describe(generateEntrypoints.name, () => {
  it('properly generates entrypoints', () => {
    const generated = {
      entrypoints: {
        [ChainSpecificAddress.from('eth', '0x01')]: entrypoint1,
      },
    }
    const generator = mockFn().returns(generated)
    const result = generateEntrypoints(
      'testProject',
      undefined,
      generator,
      Logger.SILENT,
      { updateOnly: false, keepLegacy: true },
    )
    expect(result?.entrypoints).toEqual(generated.entrypoints)
  })

  it('skips generating entrypoints when updateOnly is true', () => {
    const generator = mockFn().returns({ entrypoints: {} })
    const result = generateEntrypoints(
      'testProject',
      undefined,
      generator,
      Logger.SILENT,
      { updateOnly: true, keepLegacy: true },
    )
    expect(result?.entrypoints).toEqual(undefined)
  })

  it('overwrites entrypoints when updateOnly is true and file exists, but keepLegacy is false', () => {
    const old = {
      entrypoints: {
        [ChainSpecificAddress.from('eth', '0x01')]: entrypoint1,
      },
    }
    const generated = {
      entrypoints: {
        [ChainSpecificAddress.from('eth', '0x02')]: entrypoint2,
      },
    }
    const generator = mockFn().returns(generated)
    const result = generateEntrypoints(
      'testProject',
      old,
      generator,
      Logger.SILENT,
      { updateOnly: true, keepLegacy: false },
    )
    expect(result?.entrypoints).toEqual(generated.entrypoints)
  })

  it('keeps legacy entrypoints when keepLegacy is true, overwrites existing', () => {
    const old = {
      entrypoints: {
        [ChainSpecificAddress.from('eth', '0x01')]: entrypoint1,
        [ChainSpecificAddress.from('eth', '0x02')]: {
          ...entrypoint2,
          isLegacy: true,
        },
      },
    }
    const generated = {
      entrypoints: {
        [ChainSpecificAddress.from('eth', '0x02')]: {
          ...entrypoint2,
          project: 'new value',
        },
        [ChainSpecificAddress.from('eth', '0x03')]: entrypoint3,
      },
    }
    const generator = mockFn().returns(generated)
    const result = generateEntrypoints(
      'testProject',
      old,
      generator,
      Logger.SILENT,
      { updateOnly: true, keepLegacy: true },
    )

    expect(result?.entrypoints).toEqual({
      [ChainSpecificAddress.from('eth', '0x02')]: {
        ...entrypoint2,
        project: 'new value',
      },
      [ChainSpecificAddress.from('eth', '0x03')]: entrypoint3,
      [ChainSpecificAddress.from('eth', '0x01')]: {
        ...entrypoint1,
        isLegacy: true,
      },
    })
  })
})
